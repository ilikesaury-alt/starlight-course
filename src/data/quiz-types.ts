// 自测/练习题的统一结构化类型。
// 此前 chinese.ts(QuizItem)、eng3a.ts(EngExercise)、SelfStudyLesson(SelfQuizItem)
// 三处各自定义了字段完全相同的接口,现收敛为单一来源。
export interface QuizQuestion {
  /** 题干 */
  q: string
  options: string[]
  /** 正确选项下标 */
  answer: number
  explain?: string
  /** 错题关联的记忆卡 key(如生字/英文词句);缺省时该题错题不入错题本 */
  key?: string
  /** 记忆卡中文释义;缺省时用正确选项文本 */
  keyZh?: string
}
