const cargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "В пути",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "Ожидает отправки",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
];

const citiesList = [
  { id: 1, name: "Москва" },
  { id: 2, name: "Санкт-Петербург" },
  { id: 3, name: "Нижний Новгород" },
  { id: 4, name: "Казань" },
];

const wrapper = document.querySelector(".items-list");

const selectOrigin = document.querySelector('select[name="origin"]');
const selectDestination = document.querySelector('select[name="destination"]');

function init(list) {
  list.forEach(function (item) {
    addItem(item);
  });

  let flag = false;

  if (!flag) {
    citiesList.forEach(function (item) {
      let option = addOption(item);
      selectOrigin.append(option);
    });

    citiesList.forEach(function (item) {
      let option = addOption(item);
      selectDestination.append(option);
    });
    flag = true;
  }

  btnsInit();
}

function addOption(item) {
  let option = document.createElement("option");
  option.value = item.id;
  option.innerHTML = item.name;
  return option;
}

function addItem(item) {
  let statusClass = "alert-light";
  switch (item.status) {
    case "Ожидает отправки":
      statusClass = "alert-warning";
      break;
    case "В пути":
      statusClass = "alert-info";
      break;
    case "Доставлен":
      statusClass = "alert-success";
      break;
  }
  let wrapDiv = `
        <div class="row line-item align-items-center">
            <div class="col-12 col-lg-2 line-item-id">${item.id}</div>
            <div class="col-12 col-lg-2">${item.name}</div>
            <div class="col-12 col-lg-2">${item.origin}-${item.destination}</div>
            <div class="col-12 col-lg-2">${item.departureDate}</div>
            <div class="col-12 col-lg-2">
                <div class="alert ${statusClass}">${item.status}</div>
            </div>
            <div class="col-12 col-lg-2 text-center">
                <a href="#" class="change-status" data-bs-toggle="modal" data-bs-target="#changeStatusModal">
                    Изменить
                </a>
            </div>
        </div>
    `;
  wrapper.innerHTML += wrapDiv;
}

const form = document.querySelector("#add-position");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let errors = {
    flag: false,
    message: "",
  };

  let inputData = {};

  let lastId = cargoList[cargoList.length - 1].id;
  lastId = lastId.split("CARGO")[1];

  let newID = String(++lastId).padStart(3, "0");
  inputData["id"] = "CARGO" + newID;

  let selects = document.querySelectorAll("#add-position select");
  selects.forEach(function (i) {
    if (i.value == "no-value") {
      errors.flag = true;
      errors.message = "Не выбран город";
    } else {
      inputData[i.name] = i[i.selectedIndex].innerHTML;
    }
  });

  let inputs = document.querySelectorAll("#add-position input");
  inputs.forEach(function (i) {
    if (i.value == "") {
      errors.flag = true;
      errors.message = "Не все поля заполнены";
    } else {
      inputData[i.name] = i.value;
    }
  });

  if (!errors.flag) {
    addItem(inputData);
    cargoList.push(inputData);
    document.querySelector("#addPositionModal .btn-close").click();
    form.querySelector(".error").innerHTML = "";
    btnsInit();
  } else {
    form.querySelector(".error").innerHTML = errors.message;
  }
});

function btnsInit() {
  let changeBtns = document.querySelectorAll(".change-status");

  changeBtns.forEach((item) => {
    item.addEventListener("click", function (e) {
      let id = item
        .closest(".line-item")
        .querySelector(".line-item-id").innerHTML;
      let name = "";
      let status = "";

      cargoList.forEach(function (item) {
        if (item.id == id) {
          name = item.name;
          status = item.status;
        }
      });

      document.querySelector(".form-id-cargo").innerHTML = id;
      document.querySelector(".form-name-cargo").innerHTML = name;

      let select = document.querySelector('select[name="ch-status"]');

      switch (status) {
        case "Ожидает отправки":
          select.selectedIndex = 0;
          break;
        case "В пути":
          select.selectedIndex = 1;
          break;
        case "Доставлен":
          select.selectedIndex = 2;
          break;
      }
    });
  });
}

const formChange = document.querySelector("#change-status");

formChange.addEventListener("submit", function (e) {
  e.preventDefault();
  let errors = {
    flag: false,
    message: "",
  };

  let today = new Date();

  let select = document.querySelector('select[name="ch-status"]');
  let newStatus = select[select.selectedIndex].innerHTML;

  let id = document.querySelector(".form-id-cargo").innerHTML;

  cargoList.forEach(function (item) {
    if (item.id == id) {
      let date = item.departureDate;

      if (today < new Date(date) && newStatus == "Доставлен") {
        errors.flag = true;
        errors.message = "Груз еще не доставлен";
      } else {
        errors.flag = false;
        item.status = newStatus;
      }
    }
  });

  if (!errors.flag) {
    wrapper.innerHTML = "";
    init(cargoList);
    document.querySelector("#changeStatusModal .btn-close").click();
    formChange.querySelector(".error").innerHTML = "";
  } else {
    formChange.querySelector(".error").innerHTML = errors.message;
  }
});

const sortSelect = document.querySelector(".sort .form-select");

sortSelect.addEventListener("change", function (e) {
  wrapper.innerHTML = "";
  if (sortSelect.selectedIndex == 0) {
    init(cargoList);
  } else {
    let status = sortSelect[sortSelect.selectedIndex].innerHTML;
    let sortCargoList = cargoList.filter((item) => item.status == status);
    init(sortCargoList);
  }
});

window.addEventListener("load", function () {
  init(cargoList);
});
