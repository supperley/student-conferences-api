export const changePasswordMail = (code) => {
  return {
    subject: 'Восстановление пароля',
    html: `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        font-family: 'Public Sans', sans-serif;
      }
    
      body {
        width: 100%;
        height: 100%;
    
        background-color: transparent;
      }
    
      .mail-container {
        align-items: center;
        background-color: white;
        max-width: 761px;
        padding: 32px;
      }
    
      .text {
        color: black;
        font-size: 14px;
      }
    
      .text-big {
        font-size: 18px;
      }
    
      .text-bold {
        font-weight: bold;
      }
    
      .text-small {
        font-size: 12px;
      }
    
      .code {
        font-size: 16px;
        font-weight: bold;
        color: #9912ff;
      }
    
      .logo {    
        width: 62px;
        height: 62px;
        background-image: url('https://bntu.by/images/adv/bn1/logo.svg');
        background-repeat: no-repeat;
        margin-bottom: 10px;
      }
    
      .content {
        text-align: left;
      }
    </style>
    
    <body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <div class="mail-container">
              <table style="border: none; width: 100%; border-collapse: collapse">
                <tr>
                  <th align="center" style="border: none">
                    <div class="logo"></div>
                  </th>
                </tr>
              </table>
              <div class="content">
                <h1 class="text-big text-bold">Восстановление доступа к аккаунту</h1>
                <p class="text">
                  Для восстановления доступа, пожалуйста, перейдите по ссылке:
                </p>
                <p class="code">${code}</p>
                <p class="text">
                  Вы можете восстановить пароль в течение 10 минут с момента генерации письма. Если
                  ссылка не открывается, скопируйте и вставьте ее в адресную строку браузера.
                </p>
                <p class="text">
                  Если вы не запрашивали восстановление пароля, просто проигнорируйте это сообщение.
                </p>
                <p class="text text-small">
                  Данное сообщение генерируется автоматически, пожалуйста, не отвечайте на него.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    `,
  };
};
