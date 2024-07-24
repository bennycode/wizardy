import {EventEmitter} from 'events';
import {Prompt} from './Prompt';

export enum TOPIC {
  'END' = 'Wizardy.TOPIC.END',
  'START' = 'Wizardy.TOPIC.START',
}

export interface Wizardy<T = any> {
  on(event: TOPIC.START, listener: () => void): this;
  on(event: TOPIC.END, listener: (answers: Record<string, T>) => void): this;
}

export class Wizardy<T = any> extends EventEmitter {
  private static readonly STARTING_INDEX = -1;
  static TOPIC = TOPIC;
  answers: Record<string, T> = {};
  inConversation: boolean = false;
  private index: number = Wizardy.STARTING_INDEX;
  private questions: Prompt<T>[] = [];

  constructor(public id?: string) {
    super();
  }

  addQuestion(question: Prompt<T>): void {
    this.questions.push(question);
    if (this.index === -1) {
      this.emit(Wizardy.TOPIC.START);
      this.index = 0;
    }
  }

  addQuestions(questions: Prompt<T>[]): void {
    questions.forEach(question => this.addQuestion(question));
  }

  answer(answer: string): string {
    const question = Object.assign({}, this.questions[this.index]);
    try {
      const {answerKey, response} = question;
      const value = question.answerValue(answer, this.answers);
      this.answers[answerKey] = value;
      this.questions.shift();
      if (this.questions.length === 0) {
        this.inConversation = false;
        this.emit(Wizardy.TOPIC.END, this.answers);
      }
      return typeof response === 'string' ? response : response();
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown error without an error message.';
    }
  }

  ask(): string {
    if (this.questions.length === 0) {
      throw Error('Please add some questions.');
    }
    this.inConversation = true;
    const question = this.questions[this.index]!.question;
    return typeof question === 'string' ? question : question();
  }

  get step(): number {
    return Object.keys(this.answers).length;
  }

  reset(): void {
    this.answers = {};
    this.index = Wizardy.STARTING_INDEX;
    this.inConversation = false;
    this.questions = [];
  }
}
