const apiUrl = `https://todoo.5xcamp.us`;

const loginSection = document.querySelector(".login");
const signupSection = document.querySelector(".signup");
const email = document.querySelector("#email");
const nickname = document.querySelector("#nickname");
const password1 = document.querySelector("#password");
const password2 = document.querySelector("#password2");

const todoSection = document.querySelector(".todo");
const todoNavUser = document.querySelector(".todo_nav-user");
const empty = document.querySelector(".empty");
const cardList = document.querySelector(".card_list");
const todoNum = document.querySelector(".todoNum");

let data = [];
let newData = [];

let num;
let state = "all";
//JWT

function signUp(email, nickname, password) {
  axios
    .post(`${apiUrl}/users`, {
      user: {
        //物件後面帶變數
        email: email,
        nickname: nickname,
        password: password,
      },
    })
    .then((res) => {
      console.log(res);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "註冊成功！即先移入登入畫面!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        signupSection.classList.add("none");
        loginSection.classList.remove("none");
      }, 1500);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "註冊失敗!",
        text: "電子郵箱可能已註冊過，請返回登入或者註冊新的帳號!",
        footer: '<a href=""></a>',
      });
    });
}

function login(email, password) {
  const loginError = document.querySelector(".loginError");
  axios
    .post(`${apiUrl}/users/sign_in`, {
      user: {
        email: email,
        password: password,
      },
    })
    .then((res) => {
      axios.defaults.headers.common["Authorization"] =
        res.headers.authorization;

      //彈跳視窗
      Swal.fire({
        position: "center",
        icon: "success",
        title: "登入成功！",
        showConfirmButton: false,
        timer: 1000,
      });
      setTimeout(() => {
        loginSection.classList.add("none");
        todoSection.classList.remove("none");
      }, 1000);
      todoNavUser.innerHTML = `${res.data.nickname}的代辦`;
      getTodo();
    })
    .catch((error) => {
      loginError.classList.remove("none");
    });
}

function getTodo() {
  axios
    .get(`${apiUrl}/todos`)
    .then((res) => {
      //data為原始資料
      data = res.data.todos;

      num = data.filter((i) => i.completed_at === null).length;
      todoNum.textContent = num;

      //設定種類
      if (state == "all") {
        newData = data;
      } else if (state == "todo") {
        newData = data.filter((i) => i.completed_at == null);
      } else if (state == "done") {
        newData = data.filter((i) => i.completed_at != null);
      }
      renderdata(newData);
    })
    .catch((error) => console.log(error.response));
}

function logout() {
  axios
    .delete(`${apiUrl}/users/sign_out`)
    .then((res) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "已登出！",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        loginSection.classList.remove("none");
        todoSection.classList.add("none");
        location.reload();
      }, 1500);
    })
    .catch((error) => console.log(error.response));
}

function addTodo(content) {
  axios
    .post(`${apiUrl}/todos`, {
      todo: {
        content: content,
      },
    })
    .then((res) => {
      state = "all";
      getTodo();
    })
    .catch((error) => console.log(error.response));
}

function updateTodo(todo, todoID) {
  axios
    .put(`${apiUrl}/todos/${todoID}`, {
      todo: {
        content: todo,
      },
    })
    .then((res) => {})
    .catch((error) => console.log(error.response));
}

function deleteTodo(todoID) {
  axios
    .delete(`${apiUrl}/todos/${todoID}`)
    .then((res) => {
      getTodo();
    })
    .catch((error) => console.log(error.response));
}

function toggleTodo(todoID) {
  axios
    .patch(`${apiUrl}/todos/${todoID}/toggle`, {})
    .then((res) => {})
    .catch((error) => console.log(error.response));
}

const loginBtn = document.querySelector(".login_btn");
const loginEmail = document.querySelector("#loginemail");
const loginPassword = document.querySelector("#loginpassword");

//登入按鈕
loginBtn.addEventListener("click", (e) => {
  const errorEmail = document.querySelector(".error_email");
  const errorPassword = document.querySelector(".error_password");
  //請輸入帳號密碼的部分
  if (loginEmail.value === "") {
    errorEmail.classList.remove("none");
    return;
  }
  if (loginPassword.value === "") {
    errorPassword.classList.remove("none");
    return;
  }
  e.preventDefault();

  login(loginEmail.value, loginPassword.value);
});
//enter登入

function togglePage(e) {
  signupSection.classList.toggle("none");
  loginSection.classList.toggle("none");
}
//點擊註冊
const signupBtn = document.querySelector(".signup_btn");
const checkDouble = document.querySelector(".checkDouble");

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (password1.value !== password2.value) {
    checkDouble.classList.remove("none");
    return;
  }

  signUp(email.value, nickname.value, password1.value);
});

const cardInput = document.querySelector(".card_input");
const btnAdd = document.querySelector(".btn_add");

btnAdd.addEventListener("click", (e) => {
  e.preventDefault();

  if (cardInput.value.trim() === "") {
    alert("請輸入代辦事項");
    return;
  }

  addTodo(cardInput.value);
  cardInput.value = "";
});

cardInput.addEventListener("keyup", (e) => {
  if (cardInput.value.trim() === "") {
    alert("請輸入代辦事項");
    return;
  }
  if (e.keyCode == "13") {
    addTodo(cardInput.value);
    cardInput.value = "";
  }
});
$(".tab li").click(function (e) {
  // checkbox = 1;
  state = e.target.dataset.state;
  getTodo();

  $(this).siblings().removeClass("active");
  $(this).addClass("active");
});
const list = document.querySelector(".list");

function renderdata(XData) {
  //XData為變數，目的為語文中的data隔開
  let str = "";
  if (data.length === 0) {
    empty.classList.remove("none");
    cardList.classList.add("none");
    return;
  }

  empty.classList.add("none");
  cardList.classList.remove("none");

  XData.forEach((value) => {
    let checkMark = "";
    if (value.completed_at !== null) {
      checkMark = "checked";
    }

    str += `<li data-id=${value.id}>
<label class="checkbox" >
  <input type="checkbox"  ${checkMark}/>
  <span>${value.content}</span>
</label>

<div class="charge">
<i class="fa-solid fa-pen update_btn"></i>
<a class="delete" data-id="${value.id}"></a>
</div>
</li>`;
  });

  list.innerHTML = str;
}
const updateInput = document.querySelector(".checkbox input");
// let checkbox = 1; //表示狀態,狀態是chexkbox
list.addEventListener("click", function (e) {
  // e.preventDefault();
  //刪除
  if (e.target.nodeName === "A") {
    let deletxt = "";

    deletxt = ` <span class="deletext">刪除中請稍後...</span>`;
    e.target.closest("li").children[0].innerHTML = deletxt;

    deleteTodo(e.target.dataset.id);
  }
  //修改
  else if (e.target.nodeName === "I") {
    Swal.fire({
      title: "更新你的代辦事項",
      text: `修改前的項目：${
        e.target.closest("li").children[0].children[1].textContent
      }`,
      input: "text",
      inputValue: `${
        e.target.closest("li").children[0].children[1].textContent
      }`,
      focusConfirm: false,
      inputAttributes: {
        onclick: "this.focus();this.select()",
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonText: "確認",
    })
      .then((result) => {
        if (result.value.trim() === "") {
          alert("請輸入代辦事項");
          return;
        }
        Swal.fire({
          icon: "success",
          title: "更改完成!",
          text: `更改為：${result.value}`,
        });

        e.target.closest("li").children[0].children[1].textContent =
          result.value;
        updateTodo(result.value, e.target.closest("li").dataset.id);
      })
      .catch((e) => {});
  }
  //更改為已完成
  else if (e.target.nodeName === "INPUT") {
    if (e.target.type !== "checkbox") {
      return;
    }

    toggleTodo(e.target.closest("li").dataset.id);
    num = 0;
    for (let x = 0; x < list.children.length; x++) {
      if (!list.children[x].children[0].children[0].checked) {
        num += 1;
      }
    }
    todoNum.textContent = num;
  }
});

function deleAllDone(getTodo) {
  Swal.fire({
    title: "確定要刪除嗎?",
    text: "刪除後將不能復原!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是!刪除他!",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      //先取得資料庫的資料，計算已完成的事項的數目
      axios
        .get(`${apiUrl}/todos`)
        .then((res) => {
          data = res.data.todos;
          let delList = data.filter((i) => i.completed_at != null);

          if (delList.length !== 0) {
            //有已完成的項目
            delList.forEach((i) => {
              deleteTodo(i.id);
            });
            Swal.fire("你的文件已被刪除!", "", "success");
          } else {
            //沒有已完成的項目
            Swal.fire(
              "找不到文件!!!",
              "你沒有已完成的項目，快去完成吧!",
              "warning"
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
}
