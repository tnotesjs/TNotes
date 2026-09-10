import * as vscode from 'vscode'
import { NavPanelProvider } from './panel/NavPanelProvider'
import { getNavRoot } from './workspace'
import { detectWorkspaceMode } from './workspaceMode'

export function activate(context: vscode.ExtensionContext): void {
  const panel = new NavPanelProvider(context)

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NavPanelProvider.viewType, panel, {
      webviewOptions: { retainContextWhenHidden: true }
    }),
    vscode.commands.registerCommand('tnotesNav.refresh', () => {
      panel.refresh()
    }),
    vscode.commands.registerCommand('tnotesNav.openWorkspaceFolder', async () => {
      const picked = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Open TNotes folder'
      })
      const dir = picked?.[0]
      if (!dir) return
      await vscode.commands.executeCommand('vscode.openFolder', dir, false)
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      panel.clearSelection()
      panel.refresh()
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('tnotesNav')) {
        panel.refresh()
      }
    })
  )

  const detected = detectWorkspaceMode(getNavRoot())
  if (detected.mode === 'none') {
    void vscode.window
      .showInformationMessage(
        'TNotes Nav: 未识别到 TNotes 知识库。请在地址栏填写 tnotesjs 根目录或单个 TNotes.* 路径后点刷新，或打开对应文件夹。',
        '打开文件夹'
      )
      .then((choice) => {
        if (choice === '打开文件夹') {
          void vscode.commands.executeCommand('tnotesNav.openWorkspaceFolder')
        }
      })
  }
}

export function deactivate(): void {}
