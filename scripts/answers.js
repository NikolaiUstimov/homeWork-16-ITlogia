"use strict";
(function () {
    const Answers = {
        nameTest: null,
        answersBox: null,
        answers: null,
        backResultText: null,
        init () {
            const savedAnswers = sessionStorage.getItem('answers');
            const userAnswerData = sessionStorage.getItem('user-answers');
            this.nameTest = document.querySelector('.answers-questions-text');
            this.answersBox = document.getElementById('answers-box');

            this.showUser();
            //Получение теста из сессии браузера
            if (savedAnswers) {
                this.answers = JSON.parse(savedAnswers).forEach(test => {
                    this.nameTest.innerText = test.name;

                    //Запрос данных на сервер о правильных ответах
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", 'https://testologia.ru/get-quiz-right?id=' + test.id, false);
                    xhr.send();
                    let serverAnswers = null;
                    if (xhr.status === 200 && xhr.responseText) {
                        serverAnswers = JSON.parse(xhr.responseText);
                    }

                    //Отрисовка теста на странице
                    test.questions.forEach((question, index) => {
                        question.id = index + 1;
                        const questionBox = document.createElement('div');
                        const questionTitle = document.createElement('h2');
                        questionTitle.innerHTML = '<span>Вопрос ' + question.id +':</span> ' + question.question;
                        questionTitle.className = 'test-question-title answers-title';
                        const answerBox = document.createElement('ul');
                        answerBox.className = 'answer-question-options';
                        questionBox.append(questionTitle, answerBox);


                        question.answers.forEach((answers) => {
                            const answerElement = document.createElement('li');
                            answerElement.className = 'test-question-option';

                            const inputId = 'answer-' + answers.id;
                            const inputElement = document.createElement('input');
                            inputElement.className = 'option-answer';
                            inputElement.setAttribute('id', inputId);
                            inputElement.setAttribute('type', 'radio');
                            inputElement.setAttribute('name', 'answer' + question.id);
                            inputElement.setAttribute('value', answers.id);
                            inputElement.setAttribute('disabled', 'disabled');

                            const labelElement = document.createElement('label');
                            labelElement.setAttribute('for', inputId);
                            labelElement.innerText = answers.answer;

                            //Получение данных о выбранных ответах
                            let userAnswers = null;
                            if (userAnswerData) {
                                userAnswers = JSON.parse(userAnswerData).find((item, index) => {
                                    item.questionId = (index + 1);
                                    return item.questionId === question.id;
                                });
                            }

                            //Сравнение ответов пользователя и ответов теста
                            if (userAnswers && userAnswers.chosenAnswerId === answers.id) {
                                //Проверка совпадений ответов и применение стилей
                                if (serverAnswers.includes(answers.id)) {
                                    inputElement.classList.add('correct-answer');
                                    labelElement.classList.add('correct-answer-text');
                                } else {
                                    inputElement.classList.add('incorrect-answer');
                                    labelElement.classList.add('incorrect-answer-text');
                                }
                            }

                            answerElement.append(inputElement, labelElement);
                            answerBox.appendChild(answerElement);
                            questionBox.appendChild(answerBox);
                        });
                        this.answersBox.append(questionBox);
                    });
                });
            } else {
                window.history.back();
            }
            this.backResultText = document.getElementById('back-result').onclick = function () {
                window.history.back();
            }
        },
        showUser() {
            //Показ на странице имени, фамилии и email
            const userInfo = sessionStorage.getItem('user');
            const spanUserText = document.getElementById('user-text');
            if (userInfo) {
                let arr = JSON.parse(userInfo)
                    spanUserText.innerText = arr.slice(0, 2).join(" ") + ", " + arr[2];
            }
        },
    }
    Answers.init();
})();