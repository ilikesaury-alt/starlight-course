// 星级奖励统一口径：与题数解耦,保证不同长度测验的奖励公平。
// 全对 5 星 / 80% 以上 3 星 / 参与 1 星。
export function quizStars(correct: number, total: number): number {
  if (total <= 0) return 0
  if (correct === total) return 5
  if (correct >= total * 0.8) return 3
  return 1
}

/** 统一完成判定：正确率 ≥80% 视为通过(自动点亮「学完」),与星规同一阈值。 */
export function isPassed(correct: number, total: number): boolean {
  return total > 0 && correct >= Math.ceil(total * 0.8)
}
