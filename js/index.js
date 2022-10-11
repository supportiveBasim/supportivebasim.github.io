var input = document.getElementById("display");
var resultField = document.getElementById("output");
let history = [];

const numberButtons = document.querySelectorAll("[data-number]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");

var expressions = { pi: 3.1415, e: 2.7182 };

allClearButton.addEventListener("click", () => {
  input.value = "";
});

deleteButton.addEventListener("click", () => {
  input.value = input.value.slice(0, -1);
});

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendInput(button.innerText);
  });
});

equalsButton.addEventListener("click", (button) => {
  compute();
});

const appendInput = (data) => {
  input.value = input.value + data;
  remove_spaces(input.value);
};

const remove_spaces = (data) => {
  data = data.replace(/\s/g, "");
  var temp = document.getElementById("display");
  temp.value = data;
  input.value = temp.value;
};

const check_expression = (data) => {
  var flag = false;
  if (data.includes("=")) {
    const temp = data.split("=");
    if (['e', 'pi'].includes(temp[0])) {
      resultField.value = "You cannot use pi or e for assignment these are already used by the calculator";
    } else if (
      temp.length > 2 ||
      temp[0] == "" ||
      temp[1] == "" ||
      temp[0][0].toUpperCase() === temp[0][0].toLowerCase()
    ) {
      resultField.value = "Invalid Expression";
    } else {
      const result = evaluate(temp[0], temp[1]);
      expressions[temp[0]] = result;
      resultField.value = "Expression assigned";
      flag = true;
    }
    return flag;
  }
};

const evaluate = (key, data) => {
  var result;
  var x = data;
  const exp_keys = Object.keys(expressions);
  const exp_values = Object.values(expressions);
  exp_keys.map((e, i) => {
    x = x.replace(e, exp_values[i]);
  });
  x = x.replace("SIN", "Math.sin");
  x = x.replace("COS", "Math.cos");
  x = x.replace("TAN", "Math.tan");
  x = x.replace("SQR", "Math.sqrt");

  try {
    result = eval(x).toFixed(4);
    const d = new Date();
    const time = d.getTime();
    var x = [];
    history.push({ expression: key, result: result, id: time });
    set_history();
  } catch (err) {
    resultField.value = err.message;
  }
  return result;
};

function compute() {
  var input = document.getElementById("display");
  if (!check_expression(input.value)) {
    var x = input.value;
    const exp_keys = Object.keys(expressions);
    const exp_values = Object.values(expressions);
    exp_keys.map((e, i) => {
      x = x.replace(e, exp_values[i]);
    });
    x = x.replace("SIN", "Math.sin");
    x = x.replace("COS", "Math.cos");
    x = x.replace("TAN", "Math.tan");
    x = x.replace("SQR", "Math.sqrt");

    try {
      const result = eval(x);
      resultField.value = result.toFixed(4);
      add_item({
        expression: input.value,
        result: result,
        id: new Date().getTime(),
      });
    } catch (err) {
      resultField.value = err.message;
    }
  }
}

const add_item = (item) => {
  history.push(item);
  set_history();
};

const delete_item = (item) => {
  var temp = history.filter((i) => i.id != item);
  history = temp;
  set_history();
};

const set_history = () => {
  var temp = document.getElementById("history");
  temp.innerHTML = "";
  var data = history.map((i) => {
    if (i.result == "") {
      temp.innerHTML =
        temp.innerHTML +
        '<p style="border:1px solid black">' +
        i.expression +
        '<button style="font-size:10px; width:20px; margin-left:10px" onclick="delete_item(' +
        i.id +
        ')" >X</button></p>';
    } else {
      temp.innerHTML =
        temp.innerHTML +
        '<p>' +
        i.expression +
        " = " +
        i.result +
        "<button class='btn btn-danger ml-2 p-0 px-1' onclick='delete_item(" +
        i.id +
        ")' >X</button></p>";
    }
  });
};
