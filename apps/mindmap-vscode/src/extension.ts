import path from 'node:path'
import { randomBytes } from 'node:crypto'
import * as vscode from 'vscode'
import { assetRelativePath, createAssetFileName, referencedAssetPaths } from './assets'
import {
  isWebviewMessage,
  PROTOCOL_VERSION,
  type DocumentSnapshot,
  type ExtensionToWebviewMessage,
  type WebviewToExtensionMessage
} from './protocol'

const VIEW_TYPE = 'tnotesMindmap.editor'
const MAX_IMAGE_BYTES = 25 * 1024 * 1024

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel('TNotes Mindmap')
  output.appendLine('TNotes Mindmap extension activated')
  const provider = new MindmapEditorProvider(context, output)
  context.subscriptions.push(
    output,
    vscode.window.registerCustomEditorProvider(VIEW_TYPE, provider, {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: true
    }),
    vscode.commands.registerCommand(
      'tnotesMindmap.openAsMindmap',
      async (resource?: vscode.Uri) => {
        const uri = resource ?? vscode.window.activeTextEditor?.document.uri
        if (!uri) return
        await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE)
      }
    )
  )
}

export function deactivate() {}

class MindmapEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly output: vscode.OutputChannel
  ) {}

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel
  ): Promise<void> {
    this.output.appendLine(`Opening custom editor: ${document.uri.toString(true)}`)
    const webview = panel.webview
    const documentDirectory = parentUri(document.uri)
    webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        documentDirectory
      ]
    }
    webview.html = this.webviewHtml(webview, document.fileName)

    let disposed = false
    let editQueue = Promise.resolve()

    const post = async (message: ExtensionToWebviewMessage) => {
      if (!disposed) await webview.postMessage(message)
    }

    const snapshot = (): DocumentSnapshot => ({
      text: document.getText(),
      version: document.version,
      fileName: path.posix.basename(document.uri.path),
      assetUris: assetUriMap(webview, document.uri, document.getText())
    })

    const sendDocument = async (reason: 'init' | 'change') => {
      await post({ type: 'document', protocol: PROTOCOL_VERSION, snapshot: snapshot(), reason })
    }

    const handleEdit = async (message: Extract<WebviewToExtensionMessage, { type: 'edit' }>) => {
      const currentText = document.getText()
      if (message.text === currentText) {
        await post({
          type: 'editApplied',
          protocol: PROTOCOL_VERSION,
          changeId: message.changeId,
          version: document.version
        })
        return
      }
      if (message.baseVersion !== document.version) {
        await post({
          type: 'editRejected',
          protocol: PROTOCOL_VERSION,
          changeId: message.changeId,
          snapshot: snapshot(),
          message: '文件已在其它位置发生变化，已重新载入最新内容。'
        })
        return
      }

      const edit = new vscode.WorkspaceEdit()
      edit.replace(document.uri, fullDocumentRange(document), message.text)
      const applied = await vscode.workspace.applyEdit(edit)
      if (!applied) {
        await post({
          type: 'editRejected',
          protocol: PROTOCOL_VERSION,
          changeId: message.changeId,
          snapshot: snapshot(),
          message: 'VSCode 未能应用文档修改。'
        })
        return
      }
      this.output.appendLine(`Applied WebView edit at document version ${document.version}`)
      await post({
        type: 'editApplied',
        protocol: PROTOCOL_VERSION,
        changeId: message.changeId,
        version: document.version
      })
    }

    const handleAssetWrite = async (
      message: Extract<WebviewToExtensionMessage, { type: 'writeAsset' }>
    ) => {
      if (!vscode.workspace.isTrusted) {
        await post({
          type: 'assetWriteFailed',
          protocol: PROTOCOL_VERSION,
          requestId: message.requestId,
          message: '当前工作区尚未受信任，无法写入图片资源。'
        })
        return
      }
      try {
        const bytes = Buffer.from(message.base64, 'base64')
        if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
          throw new Error('图片为空或超过 25 MB 限制')
        }
        const assetsDirectory = vscode.Uri.joinPath(documentDirectory, 'assets')
        await vscode.workspace.fs.createDirectory(assetsDirectory)
        const fileName = await unusedAssetFileName(assetsDirectory, message.mime)
        const relativePath = assetRelativePath(fileName)
        const fileUri = vscode.Uri.joinPath(documentDirectory, ...relativePath.split('/'))
        await vscode.workspace.fs.writeFile(fileUri, bytes)
        this.output.appendLine(`Wrote image asset: ${relativePath}`)
        await post({
          type: 'assetWritten',
          protocol: PROTOCOL_VERSION,
          requestId: message.requestId,
          relativePath,
          webviewUri: webview.asWebviewUri(fileUri).toString()
        })
      } catch (error) {
        await post({
          type: 'assetWriteFailed',
          protocol: PROTOCOL_VERSION,
          requestId: message.requestId,
          message: error instanceof Error ? error.message : '图片写入失败'
        })
      }
    }

    const onMessage = (raw: unknown) => {
      if (!isWebviewMessage(raw)) return
      const message = raw
      if (message.type === 'ready') {
        this.output.appendLine(`WebView ready: ${document.uri.toString(true)}`)
        void sendDocument('init')
      } else if (message.type === 'edit') {
        editQueue = editQueue
          .then(() => handleEdit(message))
          .catch((error) => {
            void vscode.window.showErrorMessage(
              error instanceof Error ? error.message : '文档同步失败'
            )
          })
      } else if (message.type === 'writeAsset') {
        void handleAssetWrite(message)
      } else if (message.type === 'save') {
        editQueue = editQueue
          .then(async () => {
            const saved = await document.save()
            this.output.appendLine(
              saved
                ? `Saved document: ${document.uri.toString(true)}`
                : `Document save declined: ${document.uri.toString(true)}`
            )
          })
          .catch((error) => {
            void vscode.window.showErrorMessage(
              error instanceof Error ? error.message : '文档保存失败'
            )
          })
      } else if (message.type === 'openExternal') {
        const uri = safeExternalUri(message.href)
        if (uri) void vscode.env.openExternal(uri)
      }
    }

    const documentChange = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString()) void sendDocument('change')
    })
    const messageSubscription = webview.onDidReceiveMessage(onMessage)
    panel.onDidDispose(() => {
      disposed = true
      documentChange.dispose()
      messageSubscription.dispose()
    })
  }

  private webviewHtml(webview: vscode.Webview, fileName: string): string {
    const nonce = randomBytes(16).toString('base64')
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'webview.js')
    )
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview', 'webview.css')
    )
    const title = escapeHtml(path.basename(fileName))
    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data: blob:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};" />
  <title>${title}</title>
  <link rel="stylesheet" href="${styleUri}" />
</head>
<body>
  <div id="app"><div class="boot-message">正在载入 ${title}…</div></div>
  <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
</body>
</html>`
  }
}

function parentUri(uri: vscode.Uri): vscode.Uri {
  return uri.with({ path: path.posix.dirname(uri.path) })
}

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  return new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length))
}

function assetUriMap(
  webview: vscode.Webview,
  documentUri: vscode.Uri,
  markdown: string
): Record<string, string> {
  const directory = parentUri(documentUri)
  return Object.fromEntries(
    referencedAssetPaths(markdown).map((relativePath) => {
      const uri = vscode.Uri.joinPath(directory, ...relativePath.split('/'))
      return [relativePath, webview.asWebviewUri(uri).toString()]
    })
  )
}

async function unusedAssetFileName(directory: vscode.Uri, mime: string): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const name = createAssetFileName(mime)
    try {
      await vscode.workspace.fs.stat(vscode.Uri.joinPath(directory, name))
    } catch {
      return name
    }
  }
  throw new Error('无法生成不冲突的图片文件名')
}

function safeExternalUri(href: string): vscode.Uri | null {
  try {
    const uri = vscode.Uri.parse(href, true)
    return uri.scheme === 'http' || uri.scheme === 'https' ? uri : null
  } catch {
    return null
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
