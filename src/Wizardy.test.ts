import {Prompt} from './Prompt';
import {Wizardy} from './Wizardy';

describe('Wizardy', () => {
  describe('TOPIC', () => {
    it('publishes all answers when a questionnaire has been completed', done => {
      const questionnaire: Prompt<string | number>[] = [
        {
          answerKey: 'category',
          answerValue: (answer: string): string => {
            const menu = ['burger', 'pizza', 'veggie burger'];
            answer = answer.toLowerCase();
            if (menu.includes(answer)) {
              return answer;
            } else {
              throw Error(
                `Sorry, we only offer: ${menu
                  .map(category => category.charAt(0).toUpperCase() + category.substr(1))
                  .join(', ')}.`
              );
            }
          },
          question: 'What kind of food do you want to order?',
          response: 'Good choice!',
        },
        {
          answerKey: 'quantity',
          answerValue: (answer: string): number => {
            try {
              return parseInt(answer.match(/(\d+)/)![0], 10);
            } catch (error) {
              throw Error('Please write down the amount as number.');
            }
          },
          question: `How much do you want?`,
          response: 'Thanks. We will prepare your order.',
        },
      ];

      const wizard = new Wizardy();

      wizard.on(Wizardy.TOPIC.END, answers => {
        expect(answers).toEqual({
          category: 'pizza',
          quantity: 7,
        });
        done();
      });

      wizard.addQuestions(questionnaire);

      expect(wizard.ask()).toBe('What kind of food do you want to order?');
      expect(wizard.answer('Fajitas')).toBe('Sorry, we only offer: Burger, Pizza, Veggie burger.');

      expect(wizard.ask()).toBe('What kind of food do you want to order?');
      expect(wizard.answer('Pizza')).toBe('Good choice!');

      expect(wizard.ask()).toBe('How much do you want?');
      expect(wizard.answer('Seven')).toBe('Please write down the amount as number.');

      expect(wizard.ask()).toBe('How much do you want?');
      expect(wizard.answer('I would like to have 7.')).toBe('Thanks. We will prepare your order.');
    });
  });
});
