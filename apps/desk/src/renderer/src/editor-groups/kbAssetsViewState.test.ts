import { describe, expect, it } from 'vitest'

import {
  reduceAssetsPaneView,
  initialAssetsPaneViewState,
  isBrowseVisible,
  isDetailVisible,
  resolveAssetsPaneTier,
  type AssetsPaneViewState
} from './kbAssetsViewState'

describe('resolveAssetsPaneTier', () => {
  it('按面板容器宽度切三档，断点边界归入较宽的一档', () => {
    expect(resolveAssetsPaneTier(479)).toBe('narrow')
    expect(resolveAssetsPaneTier(799)).toBe('narrow')
    expect(resolveAssetsPaneTier(800)).toBe('medium')
    expect(resolveAssetsPaneTier(1199)).toBe('medium')
    expect(resolveAssetsPaneTier(1200)).toBe('wide')
    expect(resolveAssetsPaneTier(1600)).toBe('wide')
  })

  it('宽度未知时按宽屏兜底，不误判成窄屏', () => {
    expect(resolveAssetsPaneTier(0)).toBe('wide')
    expect(resolveAssetsPaneTier(Number.NaN)).toBe('wide')
    expect(resolveAssetsPaneTier(Number.POSITIVE_INFINITY)).toBe('wide')
  })
})

describe('reduceAssetsPaneView', () => {
  const narrow: AssetsPaneViewState = { tier: 'narrow', narrowView: 'browse' }

  it('窄屏选中资源切到详情，返回时回到浏览', () => {
    const selected = reduceAssetsPaneView(narrow, { type: 'select' })
    expect(selected).toEqual({ tier: 'narrow', narrowView: 'detail' })
    expect(reduceAssetsPaneView(selected, { type: 'back' })).toEqual(narrow)
  })

  it('清空选择时即使停在详情也回到浏览', () => {
    const selected = reduceAssetsPaneView(narrow, { type: 'select' })
    expect(reduceAssetsPaneView(selected, { type: 'clear-selection' })).toEqual(narrow)
  })

  it('宽/中屏两栏同显，选中不改变可见性', () => {
    for (const tier of ['medium', 'wide'] as const) {
      const state = reduceAssetsPaneView({ tier, narrowView: 'browse' }, { type: 'select' })
      expect(isBrowseVisible(state)).toBe(true)
      expect(isDetailVisible(state)).toBe(true)
    }
  })

  it('窄屏按子视图只显示一栏', () => {
    expect(isBrowseVisible(narrow)).toBe(true)
    expect(isDetailVisible(narrow)).toBe(false)
    const detail = reduceAssetsPaneView(narrow, { type: 'select' })
    expect(isBrowseVisible(detail)).toBe(false)
    expect(isDetailVisible(detail)).toBe(true)
  })

  it('从窄屏放大回宽屏时子视图复位，避免下次变窄停在详情', () => {
    const detail = reduceAssetsPaneView(narrow, { type: 'select' })
    const wide = reduceAssetsPaneView(detail, { type: 'resize', width: 1400 })
    expect(wide).toEqual({ tier: 'wide', narrowView: 'browse' })
    const backToNarrow = reduceAssetsPaneView(wide, { type: 'resize', width: 600 })
    expect(backToNarrow).toEqual({ tier: 'narrow', narrowView: 'browse' })
  })

  it('同档宽度重复上报不产生新对象，避免无谓渲染', () => {
    const state = reduceAssetsPaneView(initialAssetsPaneViewState(), {
      type: 'resize',
      width: 900
    })
    expect(reduceAssetsPaneView(state, { type: 'resize', width: 950 })).toBe(state)
  })
})
