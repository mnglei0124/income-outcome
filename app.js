var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index) {
        el.value = "";
      });

      fieldsArr[0].focus();
    },

    tusviigUzuuleh: function (tusuv) {
      document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
      document.querySelector(DOMstrings.incomeLabel).textContent =
        tusuv.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        tusuv.totalExp;
      if (tusuv.huvi === 0)
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi;
      else
        document.querySelector(DOMstrings.percentageLabel).textContent =
          tusuv.huvi + "%";
    },
    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    addListItem: function (item, type) {
      //inc, exp element beldene
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
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

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach((el) => {
      sum += el.value;
    });
    data.totals[type] = sum;
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
    tusuv: 0,
    huvi: 0,
  };

  return {
    tusuvTootsooloh: function () {
      calculateTotal("inc");
      calculateTotal("exp");
      data.tusuv = data.totals.inc - data.totals.exp;
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },
    deleteItem: function (type, id) {
      var ids = data.items[type].map((el) => {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },
    addItem: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) id = 1;
      else id = data.items[type][data.items[type].length - 1].id + 1;

      if (type === "inc") item = new Income(id, desc, val);
      else item = new Expense(id, desc, val);

      data.items[type].push(item);

      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();

var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    //oruulah ugugdul avna
    var input = uiController.getInput();

    //ugugdluudee sanhuugiin controller luu damjuulna
    if (input.description !== "" && input.value !== "") {
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      //ugugdliig tohiroh hesegt gargana
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      updateTusuv();
    }
  };

  var updateTusuv = function () {
    //tusviig tootsoh
    financeController.tusuvTootsooloh();
    //etssiin uldegdel tootsoog delgetsend gargana
    var tusuv = financeController.tusviigAvah();
    //tusviig delgetsend gargana
    uiController.tusviigUzuuleh(tusuv);
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

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          financeController.deleteItem(type, itemId);

          uiController.deleteListItem(id);

          updateTusuv();
        }
      });
  };

  return {
    init: function () {
      console.log("Application started...");
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: null,
        totalExp: null,
      });
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
