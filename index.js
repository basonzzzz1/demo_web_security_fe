let token = localStorage.getItem('token');
$(document).ready(function () {
    const loginForm = $("#loginForm");

    loginForm.submit(function (event) {
        event.preventDefault();

        const username = $("#username").val();
        const password = $("#password").val();
        const credentials = {
            username: username,
            password: password
        };

        $.ajax({
            type: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            },
            url: "http://localhost:8080/login",
            contentType: "application/json",
            data: JSON.stringify(credentials),
            success: function (data) {
                console.log(data.token);
                const roles = data.role;
                for (let i = 0; i < roles.length; i++) {
                    role = roles[i].authority;
                }
                localStorage.setItem("token", data.token);
                if (role == "ROLE_ADMIN") {
                    window.location.href = "student.html";
                } else if (role == "ROLE_USER") {
                    window.location.href = "user.html";
                } else {
                    window.location.href = "index.html";
                }
            },
            error: function (error) {
                console.log("Login failed: " + error.responseJSON.message);
                window.location.href = "index.html";
            }
        });
    });
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function getAll() {
    // Tạo ra 1 request.
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students",
        success: function (response) {
            show(response);
        },
        error: function (err) {
            console.log(err)
        }
    });
};

function getAllClass() {
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students/classRoom",
        success: function (response) {
            showClassE(response);
            showClassA(response);
            console.log(response)
        },
        error: function (err) {
            console.log(err)
        }
    });
};

function showClassE(arr) {
    let str = "";
    for (const a of arr) {
        str += `  <option value="${a.id}" >${a.className}</option>`
    }
    document.getElementById("idClassroomE").innerHTML = str;
}

function showClassA(arr) {
    let str = "";
    for (const a of arr) {
        str += `  <option value="${a.id}" >${a.className}</option>`
    }
    document.getElementById("idClassroomA").innerHTML = str;
}

getAllClass()

function show(arr) {
    let str = "";
    for (const a of arr) {
        str += ` <tr>
              <td>${a.id}</td>
              <td>${a.name}</td>
              <td>${a.address}</td>
              <td>${a.dateOfBirth}</td>
              <td>${a.email}</td>
              <td>${a.phonenumber}</td>
              <td>${a.classroom.className}</td>
              <td><button type="button" class="btn btn-warning" onclick="showEdit(${a.id})" data-toggle="modal" data-target="#modalEdit" >Edit</button></td>
              <td><button type="button" class="btn btn-danger" onclick="deleteA(${a.id})" >Delete</button></td>
             </tr>`
    }
    document.getElementById("show").innerHTML = str;
}

getAll();

function showEdit(idA) {
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students/" + idA,
        success: function (data) {
            document.getElementById("idE").value = data.id
            document.getElementById("nameE").value = data.name
            document.getElementById("addressE").value = data.address
            document.getElementById("dateofbirthE").value = data.dateOfBirth;
            document.getElementById("emailE").value = data.email;
            document.getElementById("phonenumberE").value = data.phonenumber;
            document.getElementById("idClassroomE").value = data.classroom.id;
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function edit() {
    let id = document.getElementById("idE").value;
    let name = document.getElementById("nameE").value;
    let address = document.getElementById("addressE").value;
    let dateOfBirth = document.getElementById("dateofbirthE").value;
    let email = document.getElementById("emailE").value;
    let phonenumber = document.getElementById("phonenumberE").value;
    let idClassroom = document.getElementById("idClassroomE").value;
    let student = {id, name, dateOfBirth, address, phonenumber, email, classroom: {id: idClassroom}};
    $.ajax({
        type: "Post",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students",
        data: JSON.stringify(student),
        success: function (data) {
            getAll();
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function search() {
    let search = $("#search").val();
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students/search?name=" + search,
        success: function (data) {
            show(data);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

getAll();

function deleteA(idA) {
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students/delete/" + idA,
        success: function (data) {
            getAll();
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function create() {
    let id = null;
    let name = document.getElementById("nameC").value;
    let address = document.getElementById("addressC").value;
    let dateOfBirth = document.getElementById("dateofbirthC").value;
    let email = document.getElementById("emailC").value;
    let phonenumber = document.getElementById("phonenumberC").value;
    let idClassroom = document.getElementById("idClassroomA").value;
    let student = {id, name, dateOfBirth, address, phonenumber, email, classroom: {id: idClassroom}};
    $.ajax({
        type: "Post",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/students",
        data: JSON.stringify(student),
        success: function (data) {
            getAll();
        },
        error: function (err) {
            console.log(err)
        }
    });
}
