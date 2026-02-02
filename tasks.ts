import * as fs from "fs";

/* =========================
   INTERFACE
========================= */
interface Savable {
    saveToFile(filename: string): void;
}

/* =========================
   ABSTRACT CLASS
========================= */
abstract class Item {
    constructor(public name: string) {}

    abstract display(): void;
}

/* =========================
   CHILD CLASS
========================= */
class Task extends Item implements Savable {
    constructor(name: string, public completed: boolean) {
        super(name);
    }

    display(): void {
        console.log(`Task: ${this.name} | Completed: ${this.completed}`);
    }

    saveToFile(filename: string): void {
        const data = `${this.name},${this.completed}\n`;
        fs.appendFileSync(filename, data);
    }
}

/* =========================
   MAIN PROGRAM
========================= */

const task1 = new Task("Study TypeScript", false);
const task2 = new Task("Finish Assignment", true);

task1.display();
task2.display();

task1.saveToFile("tasks.txt");
task2.saveToFile("tasks.txt");

const fileContent = fs.readFileSync("tasks.txt", "utf-8");

console.log("\nSaved File Content:");
console.log(fileContent);
