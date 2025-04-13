import { createElement } from "../utils/createElement.js";

export function createLogin() {
    const loginDiv = createElement('div', 'loginDiv', 'loginDiv');
    
    const leftArea = createLeftArea();
    loginDiv.appendChild(leftArea);
    const rightArea = createRightArea();
    loginDiv.appendChild(rightArea);

    document.body.appendChild(loginDiv);

    // [추가됨] 로그인 버튼 이벤트 핸들러 등록
    setLoginHandler();
}

function setLoginHandler() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) {
        console.error("로그인 버튼을 찾을 수 없습니다.");
        return;
    }
    
    loginBtn.style.cursor = 'pointer';
    
    loginBtn.addEventListener('click', async () => {
        const userEmail = document.getElementById('input_email').value.trim();
        const userPW = document.getElementById('input_password').value.trim();

        if (!userEmail || !userPW) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, userPW })
            });

            const result = await response.json();
            if (response.ok) {
                console.log('로그인 성공:', result);
                // [변경됨] 로그인 성공 시 빈 테스트 페이지로 리다이렉션
                window.location.href = '/land.html';
            } else {
                console.error('로그인 실패:', result.message);
                alert(`로그인 실패: ${result.message}`);
            }
        } catch (error) {
            console.error('로그인 요청 중 에러 발생:', error);
            alert('로그인 요청 중 에러가 발생했습니다.');
        }
    });
}

function createLeftArea() {
    const leftArea = createElement('div', 'leftArea', 'leftArea');

    const NonjiLogo = createElement('img', 'NonjiLogo', 'NonjiLogo');
    NonjiLogo.src = '../../assets/logos/nonji_logo.svg';
    leftArea.appendChild(NonjiLogo);

    const LoginTextDiv = createElement('div', 'loginTextDiv', 'loginTextDiv');
    leftArea.appendChild(LoginTextDiv);

    const LogInToYourAccount = createElement('div', 'LogInToYourAccount', 'LogInToYourAccount');
    LogInToYourAccount.innerText = 'Log in to your Account';
    LoginTextDiv.appendChild(LogInToYourAccount);

    const welcomeBack = createElement('div', 'welcomeBack', 'welcomeBack');
    welcomeBack.innerText = 'Welcome back! Select method to log in:';
    LoginTextDiv.appendChild(welcomeBack);

    const middleDiv = createElement('div', 'middleDiv', 'middleDiv');

    const externalLoginDiv = createElement('div', 'externalLoginDiv', 'externalLoginDiv');
    // leftArea.appendChild(externalLoginDiv);

    const googleDiv = createElement('div', 'googleLogin', 'googleLogin');
    const googleLogo = createElement('img', 'googleLoginLogo', 'googleLoginLogo');
    googleLogo.src = '../../assets/logos/logo_google.png';
    googleDiv.appendChild(googleLogo);
    const googleText = createElement('div', 'googleText', 'googleText');
    googleText.innerText = 'Google';
    googleDiv.appendChild(googleText);
    externalLoginDiv.appendChild(googleDiv);

    const kakaoDiv = createElement('div', 'kakaoLogin', 'kakaoLogin');
    const kakaoLogo = createElement('img', 'kakaoLoginLogo', 'kakaoLoginLogo');
    kakaoLogo.src = '../../assets/logos/logo_kakao.png';
    kakaoDiv.appendChild(kakaoLogo);
    const kakaoText = createElement('div', 'kakaoText', 'kakaoText');
    kakaoText.innerText = 'Kakao Talk';
    kakaoDiv.appendChild(kakaoText);
    externalLoginDiv.appendChild(kakaoDiv);

    const line = createElement('div', 'loginMiddleLine', 'loginMiddleLine');
    // leftArea.appendChild(line);

    const leftSpace = createElement('div', 'leftSpace', 'leftSpace');
    line.appendChild(leftSpace);

    const continueWithEmail = createElement('div', 'continueWithEmail', 'continueWithEmail');
    continueWithEmail.innerText = 'or continue with email';
    line.appendChild(continueWithEmail);

    const rightSpace = createElement('div', 'rightSpace', 'rightSpace');
    line.appendChild(rightSpace);
    
    const loginInputs = createElement('div', 'loginInputs', 'loginInputs');
    // leftArea.appendChild(loginInputs);

    const emailInput = createElement('input', 'input_email', 'input_email');
    emailInput.placeholder = 'Email';
    loginInputs.appendChild(emailInput);

    const passwordInput = createElement('input', 'input_password', 'input_password');
    passwordInput.placeholder = 'Password';
    passwordInput.type = 'password';
    loginInputs.appendChild(passwordInput);

    // [변경됨] 로그인 버튼 생성 (id를 "loginBtn"으로 지정)
    const loginBtn = createElement('div', 'loginBtn', 'loginBtn');
    // leftArea.appendChild(loginBtn);
    loginBtn.innerText = 'Log in';

    middleDiv.append(externalLoginDiv, line, loginInputs, loginBtn);
    leftArea.appendChild(middleDiv);

    const dontHaveAnAccount = createElement('div', 'dontHaveAnAccount', 'dontHaveAnAccount');
    leftArea.appendChild(dontHaveAnAccount);
    dontHaveAnAccount.innerHTML = 'Don’t have an account? <span style="color: var(--color-primary300)">Create an account</span>';

    return leftArea;
}

function createRightArea() {
    const rightArea = createElement('div', 'rightArea', 'rightArea');
    const rightLogo = createElement('img', 'rightLogo', 'rightLogo');
    rightLogo.src = '../../assets/imgs/login_right.svg';
    rightArea.appendChild(rightLogo);
    return rightArea;
}
