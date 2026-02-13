import type { QuizScenarioConfig } from "../types/quiz";

export const quizScenario: QuizScenarioConfig = {
  ui: {
    soundToggle: {
      onLabel: "Вимкнути звук",
      offLabel: "Увімкнути звук",
    },
    stageTransitionDelayMs: 320,
    progress: {
      ariaLabel: "Прогрес квізу",
      stageLabel: "Етап",
    },
  },
  home: {
    badge: "Valentine quiz",
    title: "Для найкоханішої",
    subtitle:
      "10 маленьких кроків до великого сюрпризу, який я зробив тільки для тебе.",
    startButton: "Почати нашу історію",
  },
  final: {
    badge: "Фінал",
    title: "Ти відкрила всі 10 сердець ❤",
    message:
      "Дякую, що ти є в моєму житті. Ти робиш мої дні теплішими, а мене кращим. Я дуже тебе кохаю.",
    rewardButton: "Відкрити подарунок",
    rewardLine1:
      "Нагорода: купон на ідеальне побачення + 1000 обіймів без обмежень.",
    rewardLine2: "Промокод: LOVE-FOREVER",
  },
  stages: [
    {
      id: 1,
      kind: "choice",
      title: "Етап 1",
      prompt: "Хто ти для мене?",
      options: [
        { id: "muse", label: "Моя муза" },
        { id: "inspiration", label: "Моє натхнення" },
        { id: "universe", label: "Мій всесвіт" },
      ],
      rules: {
        type: "correct_option",
        correctOptionId: "universe",
        incorrectMessage: "Майже, спробуй ще раз ❤",
      },
      rewardLabel: "Серце щирості",
    },
    {
      id: 2,
      kind: "choice",
      title: "Етап 2",
      prompt: "Який наш момент варто прожити ще раз?",
      options: [
        { id: "first-meet", label: "Перша зустріч" },
        { id: "first-walk", label: "Перша прогулянка" },
        { id: "first-hug", label: "Перші обійми" },
      ],
      rules: {
        type: "any",
      },
      rewardLabel: "Серце спогадів",
    },
    {
      id: 3,
      kind: "truth",
      title: "Етап 3",
      prompt: "Правда чи неправда?",
      statement: "Я закохуюсь у тебе ще сильніше щодня.",
      trueButtonLabel: "Правда",
      falseButtonLabel: "Неправда (але мило)",
      rules: {
        type: "correct_answer",
        correctAnswer: "truth",
        incorrectMessage: "Відповідь інша, але ти все одно прекрасна ❤",
      },
      rewardLabel: "Серце чесності",
    },
    {
      id: 4,
      kind: "catch",
      title: "Етап 4",
      prompt: "Міні-гра: злови сердечка за 10 секунд!",
      rules: {
        target: 10,
        durationSec: 5,
        allowRetryAfterTimeout: true,
        timeoutPraiseText: "Класно впоралась! Ще одна спроба і точно рекорд ❤",
        retryButtonLabel: "Спробувати ще раз",
      },
      scoreLabel: "Спіймано",
      timeLabel: "Час",
      secondsSuffix: "с",
      heartAriaLabel: "Спіймати сердечко",
      rewardLabel: "Серце драйву",
    },
    {
      id: 5,
      kind: "preference",
      title: "Етап 5",
      prompt: "Що ідеально підходить для нашого вечора?",
      options: [
        { id: "sushi-movie", label: "Суші + фільм" },
        { id: "pizza-series", label: "Піца + серіал" },
        { id: "dessert-walk", label: "Десерт + прогулянка" },
      ],
      helper: "Вибери те, що сьогодні хочеться найбільше.",
      rules: {
        type: "any",
      },
      rewardLabel: "Серце смаків",
    },
    {
      id: 6,
      kind: "date",
      title: "Етап 6",
      prompt: "Вгадай особливий день нашої історії",
      hint: "Підказка: це день, після якого все стало тепліше.",
      placeholder: "Наприклад: 14.02",
      submitButtonLabel: "Підтвердити",
      rules: {
        acceptedAnswers: ["14.02", "14/02", "14-02"],
        normalize: "trim_lower",
        incorrectMessage: "Спробуй ще, це дуже особлива дата ❤",
      },
      rewardLabel: "Серце дат",
    },
    {
      id: 7,
      kind: "puzzle",
      title: "Етап 7",
      prompt: "Збери фразу-комплімент у правильному порядку",
      words: ["ти", "неймовірна", "моя", "дівчинка"],
      previewPlaceholder: "...",
      rules: {
        acceptedPhrases: ["ти неймовірна моя дівчинка"],
        normalize: "trim_lower",
        incorrectMessage:
          "Трохи інакше, але мені все одно подобається твій варіант ❤",
      },
      rewardLabel: "Серце слів",
    },
    {
      id: 8,
      kind: "choice",
      title: "Етап 8",
      prompt: "Ідеальне побачення просто зараз?",
      options: [
        { id: "city-night", label: "Вечір у місті" },
        { id: "home-cocoa", label: "Плед і какао вдома" },
        { id: "spontaneous-trip", label: "Раптова мандрівка" },
      ],
      rules: {
        type: "any",
      },
      rewardLabel: "Серце мрій",
    },
    {
      id: 9,
      kind: "audio",
      title: "Етап 9",
      prompt: "Натисни, щоб почути романтичний аудіо-сюрприз",
      caption: "Навіть коли мовчу, я думаю про тебе з усмішкою.",
      playButtonLabel: "Відтворити",
      continueButtonLabel: "Продовжити",
      rules: {
        requirePlayBeforeContinue: true,
      },
      rewardLabel: "Серце мелодій",
    },
    {
      id: 10,
      kind: "choice",
      title: "Етап 10",
      prompt: "Готова до фінального сюрпризу?",
      options: [
        { id: "yes-very", label: "Так, дуже" },
        { id: "yes-of-course", label: "Так, звісно" },
        { id: "already-waiting", label: "Я вже чекаю" },
      ],
      rules: {
        type: "any",
      },
      rewardLabel: "Серце очікування",
    },
  ],
};
