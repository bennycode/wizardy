export interface Prompt<T> {
  /**
   * Key for the answer which will be used to store its parsed value in the 'answers' object, which will be returned at the end of the conversation.
   */
  answerKey: string;
  /**
   * Function which validates, parses and returns the value from a user's answer to the current question. If the user's input is invalid, the
   * function should throw an `Error` with a meaningful message that can be sent back to the user.
   * @param answer - A user's answer to the current question.
   */
  answerValue: (answer: string) => T;
  /**
   * A question, which is asked to the user.
   */
  question: (() => string) | string;
  /**
   * A reply which will be sent to the user when the question is answered with valid input.
   */
  response: (() => string) | string;
}
