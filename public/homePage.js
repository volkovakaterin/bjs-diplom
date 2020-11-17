const logout = new LogoutButton();
logout.action = function () {
    ApiConnector.logout(response => {
        if (response.success === true) {
            location.reload();
        }
    });
}

ApiConnector.current(response => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data)
    }
});

const ratesBoard = new RatesBoard();
function getStocks() {
    ApiConnector.getStocks(response => {
        if (response.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    })
}
getStocks();
let timerGetStocks = setInterval(getStocks, 60000);
alert(timerGetStocks);

const money = new MoneyManager();
money.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, `Баланс пополнен на ${data.amount} ${data.currency}`);
        } else {
            money.setMessage(response.success, `${response.error}`);
        }
    })
}

money.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, `Успешная конвертация`);
        } else {
            money.setMessage(response.success, `${response.error}`);
        }
    })
}

money.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, `Успешный перевод`);
        } else {
            money.setMessage(response.success, `${response.error}`);
        }
    })
}

const favorites = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if(response.success === true) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        money.updateUsersList(response.data);
    } 
})

favorites.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, response => {
        if(response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            money.updateUsersList(response.data);
            money.setMessage(response.success, `Пользователь ${data.id} ${data.name} добавлен`);
        } else {
            money.setMessage(response.success, `${response.error}`)
        } 
    })
}

favorites.removeUserCallback = function(data) {
  ApiConnector.removeUserFromFavorites(data, response => {
    if(response.success === true) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        money.updateUsersList(response.data);
        money.setMessage(response.success, `Пользователь ID ${data} удалён`);
    } else {
        money.setMessage(response.success, `${response.error}`)
    }   
  })
}