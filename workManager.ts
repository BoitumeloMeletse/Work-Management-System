import * as fs from "fs";
import * as readline from "readline";

/* ========================
   INTERFACE
======================== */
interface FileHandler {
    saveToFile(filename: string): void;
}

/* ========================
   ABSTRACT CLASS
======================== */
abstract class WorkItem {
    constructor(public title: string) {}

    abstract display(): void;
}

/* ========================
   CHILD CLASS
======================== */
class WorkTask extends WorkItem implements FileHandler {
    constructor(title: string, public completed: boolean = false) {
        super(title);
    }

    display(): void {
        console.log(`${this.title} | Completed: ${this.completed}`);
    }

    saveToFile(filename: string): void {
        const data = `${this.title},${this.completed}\n`;
        fs.appendFileSync(filename, data);
    }
}

/* ========================
   WORK MANAGEMENT SYSTEM
======================== */
class WorkManager {
    private tasks: WorkTask[] = [];
    private fileName = "works.txt";

    constructor() {
        this.loadFromFile();
    }

    addTask(title: string) {
        const task = new WorkTask(title);
        this.tasks.push(task);
        task.saveToFile(this.fileName);
        console.log("✅ Task added.");
    }

    showTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }

        console.log("\n📋 Work Tasks:");
        this.tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.title} | Completed: ${task.completed}`);
        });
    }

    completeTask(index: number) {
        if (index < 0 || index >= this.tasks.length) {
            console.log("Invalid task number.");
            return;
        }

        this.tasks[index].completed = true;
        this.saveAll();
        console.log("✅ Task marked as completed.");
    }

    private loadFromFile() {
        if (!fs.existsSync(this.fileName)) return;

        const data = fs.readFileSync(this.fileName, "utf-8");
        const lines = data.split("\n").filter(line => line);

        this.tasks = lines.map(line => {
            const [title, completed] = line.split(",");
            return new WorkTask(title, completed === "true");
        });
    }

    private saveAll() {
        fs.writeFileSync(this.fileName, "");
        this.tasks.forEach(task => task.saveToFile(this.fileName));
    }
}

/* ========================
   TERMINAL MENU
======================== */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const manager = new WorkManager();

function showMenu() {
    console.log("\n===== WORK MANAGEMENT SYSTEM =====");
    console.log("1. Add Work Task");
    console.log("2. View Tasks");
    console.log("3. Complete Task");
    console.log("4. Exit");

    rl.question("Choose an option: ", handleMenu);
}

function handleMenu(choice: string) {
    switch (choice) {
        case "1":
            rl.question("Enter task title: ", title => {
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
            rl.question("Enter task number to complete: ", num => {
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
