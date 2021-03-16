var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    addListItem: function (item, type) {
      //inc, exp element beldene
      var html, list;
      if (type === "inc") {
        list = ".income__list";
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = ".expenses__list";
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      }
      //orlogo zarlagiin utguudiig replace eer hiij ugnu
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);
      //dom ruu hiij ugnu
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },

    totals: {
      inc: 0,
      exp: 0,
    },
  };

  return {
    addItem: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else id = data.items[type][data.items[type].length - 1].id + 1;

      if (type === "inc") item = new Income(id, desc, val);
      else item = new Expense(id, desc, val);

      data.items[type].push(item);

      return item;
    },
    data: function () {
      return data;
    },
  };
})();

var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    //oruulah ugugdul avna
    var input = uiController.getInput();

    //ugugdluudee sanhuugiin controller luu damjuulna
    var item = financeController.addItem(
      input.type,
      input.description,
      input.value
    );

    //ugugdliig tohiroh hesegt gargana
    uiController.addListItem(item, input.type);

    //tusviig tootsoh
    //etssiin uldegdel tootsoog delgetsend gargana
  };
  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function () {
      console.log("Application started...");
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();

// var budget = document.querySelector(".budget__value");
// budget.insertAdjacentHTML(
//   "beforeend",
//   '<div style="background-color:aqua; padding: 50px; color: white;"><p>Mai</p></div>'
// );
// document.querySelector(
//   ".budget__value"
// ) = '<div style="background-color:aqua; padding: 50px; color: white;"><p>Mai</p></div>';
