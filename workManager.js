"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
/* ========================
   ABSTRACT CLASS
======================== */
var WorkItem = /** @class */ (function () {
    function WorkItem(title) {
        this.title = title;
    }
    return WorkItem;
}());
/* ========================
   CHILD CLASS
======================== */
var WorkTask = /** @class */ (function (_super) {
    __extends(WorkTask, _super);
    function WorkTask(title, completed) {
        if (completed === void 0) { completed = false; }
        var _this = _super.call(this, title) || this;
        _this.completed = completed;
        return _this;
    }
    WorkTask.prototype.display = function () {
        console.log("".concat(this.title, " | Completed: ").concat(this.completed));
    };
    WorkTask.prototype.saveToFile = function (filename) {
        var data = "".concat(this.title, ",").concat(this.completed, "\n");
        fs.appendFileSync(filename, data);
    };
    return WorkTask;
}(WorkItem));
/* ========================
   WORK MANAGEMENT SYSTEM
======================== */
var WorkManager = /** @class */ (function () {
    function WorkManager() {
        this.tasks = [];
        this.fileName = "works.txt";
        this.loadFromFile();
    }
    WorkManager.prototype.addTask = function (title) {
        var task = new WorkTask(title);
        this.tasks.push(task);
        task.saveToFile(this.fileName);
        console.log("✅ Task added.");
    };
    WorkManager.prototype.showTasks = function () {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }
        console.log("\n📋 Work Tasks:");
        this.tasks.forEach(function (task, index) {
            console.log("".concat(index + 1, ". ").concat(task.title, " | Completed: ").concat(task.completed));
        });
    };
    WorkManager.prototype.completeTask = function (index) {
        if (index < 0 || index >= this.tasks.length) {
            console.log("Invalid task number.");
            return;
        }
        this.tasks[index].completed = true;
        this.saveAll();
        console.log("✅ Task marked as completed.");
    };
    WorkManager.prototype.loadFromFile = function () {
        if (!fs.existsSync(this.fileName))
            return;
        var data = fs.readFileSync(this.fileName, "utf-8");
        var lines = data.split("\n").filter(function (line) { return line; });
        this.tasks = lines.map(function (line) {
            var _a = line.split(","), title = _a[0], completed = _a[1];
            return new WorkTask(title, completed === "true");
        });
    };
    WorkManager.prototype.saveAll = function () {
        var _this = this;
        fs.writeFileSync(this.fileName, "");
        this.tasks.forEach(function (task) { return task.saveToFile(_this.fileName); });
    };
    return WorkManager;
}());
/* ========================
   TERMINAL MENU
======================== */
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var manager = new WorkManager();
function showMenu() {
    console.log("\n===== WORK MANAGEMENT SYSTEM =====");
    console.log("1. Add Work Task");
    console.log("2. View Tasks");
    console.log("3. Complete Task");
    console.log("4. Exit");
    rl.question("Choose an option: ", handleMenu);
}
function handleMenu(choice) {
    switch (choice) {
        case "1":
            rl.question("Enter task title: ", function (title) {
                manager.addTask(title);
                showMenu();
            });
            break;
        case "2":
            manager.showTasks();
            showMenu();
            break;
        case "3":
            manager.showTasks();
            rl.question("Enter task number to complete: ", function (num) {
                manager.completeTask(Number(num) - 1);
                showMenu();
            });
            break;
        case "4":
            console.log("Goodbye 👋");
            rl.close();
            break;
        default:
            console.log("Invalid choice.");
            showMenu();
    }
}
showMenu();
