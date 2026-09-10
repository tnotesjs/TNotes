import { z } from 'zod'

import {
  applyAssetPlan,
  listAssetHistory,
  planAssetMerge,
  planAssetOptimize,
  planAssetRecycle,
  planAssetRename,
  previewAssetOptimize,
  restoreAssetPlan
} from '../assetOperations'
import { workspaceManager } from '../workspaceManager'
import { IPC_CHANNELS } from '../../shared/contracts'
import { handle, noInputSchema, type GetWindow } from './shared'

export function registerAssets(getWindow: GetWindow): () => void {
  handle(
    IPC_CHANNELS.assetsScan,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      generation: z.number().int().nonnegative()
    }),
    ({ knowledgeBaseId, generation }) => workspaceManager.scanAssets(knowledgeBaseId, generation)
  )
  handle(IPC_CHANNELS.assetsScanCancel, getWindow, z.string().min(1), (knowledgeBaseId) => {
    workspaceManager.cancelAssetScan(knowledgeBaseId)
  })
  handle(IPC_CHANNELS.assetsSummaries, getWindow, noInputSchema, () =>
    workspaceManager.listAssetSummaries()
  )
  handle(
    IPC_CHANNELS.assetsPlanRename,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      fromRelPath: z.string().min(1),
      toRelPath: z.string().min(1),
      generation: z.number().int().nonnegative().optional()
    }),
    (input) => planAssetRename(input)
  )
  handle(
    IPC_CHANNELS.assetsPlanRecycle,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      relPaths: z.array(z.string().min(1)).min(1),
      generation: z.number().int().nonnegative().optional()
    }),
    (input) => planAssetRecycle(input)
  )
  handle(
    IPC_CHANNELS.assetsPlanMerge,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      keepRelPath: z.string().min(1),
      dropRelPaths: z.array(z.string().min(1)).min(1),
      generation: z.number().int().nonnegative().optional()
    }),
    (input) => planAssetMerge(input)
  )
  const optimizeOptions = z.object({
    encoder: z.enum(['sharp', 'oxipng']),
    quality: z.number().int().min(40).max(100),
    maxDimension: z.number().int().min(64).max(10_000).nullable(),
    outputFormat: z.enum(['keep', 'webp', 'jpeg'])
  })
  handle(
    IPC_CHANNELS.assetsPreviewOptimize,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      relPaths: z.array(z.string().min(1)).min(1),
      options: optimizeOptions,
      generation: z.number().int().nonnegative().optional()
    }),
    (input) => previewAssetOptimize(input)
  )
  handle(
    IPC_CHANNELS.assetsPlanOptimize,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      relPaths: z.array(z.string().min(1)).min(1),
      options: optimizeOptions,
      generation: z.number().int().nonnegative().optional()
    }),
    (input) => planAssetOptimize(input)
  )
  handle(
    IPC_CHANNELS.assetsApply,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      planId: z.string().min(1)
    }),
    ({ knowledgeBaseId, planId }) => applyAssetPlan(knowledgeBaseId, planId)
  )
  handle(
    IPC_CHANNELS.assetsRestore,
    getWindow,
    z.object({
      knowledgeBaseId: z.string().min(1),
      planId: z.string().min(1)
    }),
    ({ knowledgeBaseId, planId }) => restoreAssetPlan(knowledgeBaseId, planId)
  )
  handle(IPC_CHANNELS.assetsHistory, getWindow, z.string().min(1), (knowledgeBaseId) =>
    listAssetHistory(knowledgeBaseId)
  )

  const offProgress = workspaceManager.onAssetScanProgress((progress) => {
    const window = getWindow()
    if (window && !window.isDestroyed()) {
      window.webContents.send(IPC_CHANNELS.assetsScanProgress, progress)
    }
  })
  return offProgress
}
