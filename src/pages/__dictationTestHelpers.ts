// 测试辅助：直接读 eng3a 真实词池，验证页面取词链路确实落在教材数据上。
import { MODULES } from '@/data/modules'

export function eng3aMetaWords(): string[] {
  return MODULES.eng3a.items.flatMap((it) =>
    MODULES.eng3a.getWords(it.id).map((w) => w.en),
  )
}
