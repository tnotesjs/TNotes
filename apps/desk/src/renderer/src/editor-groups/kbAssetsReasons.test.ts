import { describe, expect, it } from 'vitest'

import {
  classifyAssetWriteBlocks,
  classifyAssetWriteMessage,
  renameBlockCode,
  renameBlockReason
} from './kbAssetsReasons'

describe('classifyAssetWriteMessage', () => {
  it('labels coverage, dirty, stale plan and incomplete journals', () => {
    expect(classifyAssetWriteMessage('扫描覆盖未完成，无法证明未知来源与该文件无关')).toBe(
      'coverage'
    )
    expect(classifyAssetWriteMessage('「概述」有未保存更改，请先保存或丢弃后再整理资源')).toBe(
      'dirty'
    )
    expect(
      classifyAssetWriteMessage('计划已过期: assets/used.png 已改变', 'REVISION_CONFLICT')
    ).toBe('stale-plan')
    expect(classifyAssetWriteMessage('该知识库有未完成的资源事务，请先恢复后再继续')).toBe(
      'incomplete'
    )
  })
})

describe('资源重命名门禁', () => {
  it('画布（真相源）明确不可重命名，并给出可读原因', () => {
    const code = renameBlockCode({ renameAllowed: false, protection: ['excalidraw-source'] })
    expect(code).toBe('excalidraw-source')
    expect(renameBlockReason(code)).toContain('归属编号')
  })

  it('允许改名时不产生任何提示', () => {
    expect(renameBlockCode({ renameAllowed: true, protection: [] })).toBe('none')
    expect(renameBlockReason('none')).toBe('')
  })

  it('区分图标/符号链接/覆盖未完成', () => {
    expect(renameBlockCode({ renameAllowed: false, protection: ['kb-icon'] })).toBe('kb-icon')
    expect(renameBlockCode({ renameAllowed: false, protection: ['symlink-escape'] })).toBe(
      'symlink-escape'
    )
    expect(renameBlockCode({ renameAllowed: false, protection: [] })).toBe('coverage')
    expect(renameBlockReason('coverage')).toContain('未知引用')
  })
})

describe('classifyAssetWriteBlocks', () => {
  it('uses gate codes from apply details without duplicating the joined message', () => {
    const items = classifyAssetWriteBlocks({
      error: {
        code: 'INVALID_OPERATION',
        message: '「概述」有未保存更改，请先保存或丢弃后再整理资源',
        details: {
          blockedReasons: [
            {
              code: 'dirty-document',
              message: '「概述」有未保存更改，请先保存或丢弃后再整理资源'
            }
          ]
        }
      }
    })
    expect(items).toEqual([
      {
        category: 'dirty',
        label: '有未保存文档',
        message: '「概述」有未保存更改，请先保存或丢弃后再整理资源'
      }
    ])
  })

  it('keeps plan coverage reasons distinct from stale apply errors', () => {
    expect(
      classifyAssetWriteBlocks({
        planReasons: ['该资源存在未知引用或覆盖未完成，不能重命名']
      })
    ).toEqual([
      {
        category: 'coverage',
        label: '仍需适配来源',
        message: '该资源存在未知引用或覆盖未完成，不能重命名'
      }
    ])
    expect(
      classifyAssetWriteBlocks({
        error: { code: 'needs-recovery', message: '资源操作未完成' }
      })[0]?.label
    ).toBe('事务待恢复')
  })
})
