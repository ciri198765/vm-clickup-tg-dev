export {strings as default, strings};

const dictionary = {
  de: {},
  en: {
    agree: 'Do you agree?',
    agreementInfo: `What kind of information do we keep and process?
First of all, we do need to keep your telegram id for technical \
reasons, so you could use our TG bot. Moreover, we could need to \
keep and process data, you provide us about your case.

[More info](https://www.equal-postost.org/home/about-us/datenschutz)`,
    doYouAgree: `To continue, we need your consent to process and \
store personal data. Do you agree?`,
    feedback: `[Get a feedback](https://www.equal-postost.org/feedback)`,
    howCanWeHelp: `Please, describe in one message, what happened \
and how we can help you.`,
    info: 'Info',
    no: 'No',
    thank: 'Thank you',
    weCannotProceed: `If you do not give us consent to store and \
process your personal data, we cannot proceed.`,
    welcomeBack: 'Welcome back. We are glad to see you again.',
    yes: 'Yes',
  },
  ru: {
    agree: 'Согласны?',
    agreementInfo: `Какую информацию мы храним или обрабатываем?
В первую очередь, по техническим причинам нам необходимо хранить \
информацию о вашем профиле ТГ. Также в процессе обработки вашего \
запроса вы можете предоставлять данные личного характера, которые \
нам будет необходимо обрабатывать или временно хранить.

[Подробнее](https://www.equal-postost.org/home/about-us/datenschutz)`,
    contacts: `Наши новости и соцсети:
📎 [Telegram-канал](https://t.me/equal_postost)
📎 [Instagram](https://instagram.com/equal_postost)
📎 [Facebook](https://www.facebook.com/equal.postost)

Получить помощь:
[Telegram-бот](https://t.me/equal_postost_bot) или \
[Email](mailto:sos@equal-postost.org)

[Нужно временное жилье](https://t.me/equal_home)

Отправить донат или подписаться на ежемесячное пожертвование:\
[PayPal](https://www.paypal.com/donate/?hosted_button_id=6VRW6LGY75JZ2)

[Стать частью волонтёрской команды EQUAL PostOst]\
(https://t.me/equal_postost_bot)

[Предложить сотрудничество (email)](mailto:info@equal-postost.org)

[Подробнее о нас](https://www.equal-postost.org/)`,
    donate: `[PayPal](https://www.paypal.com/donate/?hosted_button_id=6VRW6LGY75JZ2)`,
    doYouAgree: `Чтобы продолжить, нам нужно ваше согласие на \
обработку и хранение персональных данных. Вы согласны?`,
    feedback: `[Оставить отзыв](https://www.equal-postost.org/feedback)`,
    howCanWeHelp: `Опишите, пожалуйста, в одном сообщении вашу \
ситуацию, и чем мы можем вам помочь.`,
    info: 'Инфо',
    no: 'Нет',
    thank: 'Спасибо',
    weCannotProceed: `Если вы не даете нам согласие на хранение и \
обработку ваших персональных данных, мы не можем продолжить.`,
    welcomeBack: 'С возвращением. Рады видеть Вас снова.',
    yes: 'Да',
  },
  test: { // INFO: for testing purposes
    thank: 'Thank you', // do not change nor delete
    // do not add new strings
  },
};

/**
 * @typedef {Object<string, typeof dictionary['ru']>} strings
 */
dictionary.default = dictionary['ru'];

const handler = {
  get: function(target, prop) {
    if (Object.keys(target).includes(prop)) return this[prop];
    return this.default;
  },
};

Object.keys(dictionary).forEach((lang) =>
  handler[lang] = new Proxy(dictionary, {
    get: function(target, prop) {
      if (prop in target[lang]) return target[lang][prop];
      return target.default[prop];
    },
    getOwnPropertyDescriptor: () => ({enumerable: true, configurable: true}),
    ownKeys: (target) => Object.keys(target[lang]),
  }),
);

/**
 * @type {strings}
 */
const strings = new Proxy(dictionary, handler);
