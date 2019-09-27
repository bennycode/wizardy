# Wizardy 🧙📜

Wizardy is a conversational wizard which helps you to easily build prompts and questionnaires. It has been designed to be used with messenger applications to generate bot interactions but it is generic and can be used in many ways.

## ❯ Features

- **Easy-to-use.** Wizardy's API is dead simple, [easy to use](#-usage) and easy to replace (if you ever want to).
- **Typed.** Wizardy is written [100% in TypeScript](./src/Wizardy.ts), so there is no need to install typings from an external source.
- **Tested.** Do not be surprised when using Wizardy, it ships with [100% code coverage](./src/Wizardy.test.ts).
- **Documented.** Modern documentation lives in code. That's why [Wizardy's interface](./src/Prompt.ts) contains TSDoc comments.
- **Compatible.** Node.js, Browsers? [Run Wizardy](https://runkit.com/npm/wizardy) on the platform of your choice!
- **Independent.** Don't be afraid of big lock files. Wizardy uses [zero dependencies](https://www.npmjs.com/package/wizardy?activeTab=dependencies).

## ❯ Installation

```bash
npm install wizardy
```

```bash
yarn add wizardy
```

## ❯ Usage

**Node.js**

```js
const {Prompt, Wizardy} = require('wizardy');

const wizard = new Wizardy();

wizard.on(Wizardy.TOPIC.START, () => console.log('Wizard started...'));
wizard.on(Wizardy.TOPIC.END, answers => {
  console.log('Wizard ended', answers); // Wizard ended { category: 'pizza', quantity: 7 }
});

const questionnaire = [
  {
    answerKey: 'category',
    answerValue: answer => {
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
    answerValue: answer => {
      try {
        return parseInt(answer.match(/(\d+)/)[0], 10);
      } catch (error) {
        throw Error('Please write down the amount as number.');
      }
    },
    question: `How much do you want?`,
    response: 'Thanks. We will prepare your order.',
  },
];

wizard.addQuestions(questionnaire);

console.log(wizard.ask()); // What kind of food do you want to order?
console.log(wizard.answer('Fajitas')); // Sorry, we only offer: Burger, Pizza, Veggie burger.

console.log(wizard.ask()); // What kind of food do you want to order?
console.log(wizard.answer('Pizza')); // Good choice!

console.log(wizard.ask()); // How much do you want?
console.log(wizard.answer('Seven')); // Please write down the amount as number.

console.log(wizard.ask()); // How much do you want?
console.log(wizard.answer('I would like to have 7.')); // Thanks. We will prepare your order.
```

**TypeScript**

```ts
import {Prompt, Wizardy} from 'wizardy';
```
