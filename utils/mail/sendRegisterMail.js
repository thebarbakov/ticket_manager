const sendEmail = require("./sendEmail");

const { MAIL_ADDRESS } = process.env;

const sendRegisterMail = async ({ user, team }) => {
  if (!user || !team) return;
  console.log(1)
  await sendEmail({
    to: user.email,
    subject: "Регистрация на Inspiro Eda",
    html: `
        <h1>Добро пожаловать в Inspiro Eda</h1>
        <br />
        <p>Благодарим за использование нашего сервиса.</p>
        <p>Мы создали личный кабинет для Вас. Вам осталось настроить систему и внести в систему членов Вашей команды. Вы можете сделать это <a href="https://eda.inspiro.ru" target="_blank">здесь</a></p>
        <br />
        <p>Ваши данные (чтобы вы не сомневались, что это Вы):</p>
        <p>Имя: ${user.name}</p>
        <p>E-Mail: ${user.email}</p>
        <p>Название команды: ${team.name}</p>
        <br />
        <br />
        <br />
        <br />
        <p>-----------------------------------</p>
        <p>Inspiro Eda</p>
        `,
  });
};

module.exports = sendRegisterMail;
