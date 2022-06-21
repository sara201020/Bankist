'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.balance = acc.movements.reduce(function (acc, num) {
      return (acc += num);
    }, 0);
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (myname) {
        return myname[0];
      })
      .join('');
  });
};
createUsername(accounts);

let currentAcc;

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  let movs;
  if (sort) {
    movs = movements.slice().sort(function (a, b) {
      return a - b;
    });
  } else {
    movs = movements;
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayAccSum = function (acc) {
  const sum = acc.movements.reduce(function (acc, num) {
    return (acc += num);
  }, 0);
  labelBalance.textContent = `${sum} EUR`;
};

const displayMoneySummary = function (acc) {
  const totalIn = acc.movements
    .filter(function (num) {
      return num > 0;
    })
    .reduce(function (acc, num) {
      return acc + num;
    }, 0);
  labelSumIn.textContent = totalIn + '€';

  const totalOut = acc.movements
    .filter(function (num) {
      return num < 0;
    })
    .reduce(function (acc, num) {
      return acc + num;
    }, 0);
  labelSumOut.textContent = Math.abs(totalOut) + '€';

  const totalInt = acc.movements
    .filter(function (num) {
      return num > 0;
    })
    .map(function (num) {
      return (num * 1.2) / 100;
    })
    .filter(function (num) {
      return num > 1;
    })
    .reduce(function (acc, num) {
      return acc + num;
    }, 0);
  labelSumInterest.textContent = Math.abs(totalInt) + '€';
};

const updateUI = function (acc) {
  /// display acc sum
  displayAccSum(currentAcc);
  /// display movements
  displayMovements(currentAcc.movements);
  /// display money summary
  displayMoneySummary(currentAcc);
};

/// login btn
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(function (acc) {
    return acc.userName === inputLoginUsername.value;
  });

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    /// dispaly app
    containerApp.style.opacity = 100;
    /// empty input
    inputLoginUsername.value = inputLoginPin.value = ' ';
    /// update UI
    updateUI(currentAcc);
    /// diplay name
    labelWelcome.textContent = `welcome, ${currentAcc.owner.split(' ')[0]}`;
  }
});

/// transfer btn
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const accTransTo = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  const transAmount = inputTransferAmount.value;

  if (
    transAmount <= currentAcc.balance &&
    accTransTo?.userName !== currentAcc
  ) {
    currentAcc.movements.push(-transAmount);
    accTransTo.movements.push(Number(transAmount));
    console.log(currentAcc.movements);
    console.log(accTransTo.movements);
    /// update UI
    updateUI(currentAcc);
    console.log('valid');
  } else {
    console.log('un valid');
  }
});

/// close btn
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAcc.userName === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName === currentAcc.userName;
    });
    accounts.splice(index, 1);
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
});

/// loan btn
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAcc.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
  }
});

/// sort btn

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  console.log(sorted);
  displayMovements(currentAcc.movements, sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
