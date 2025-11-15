function parseInput(id) {
    return document.getElementById(id).value
        .split(",")
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x));
}

function allocate(blocks, processes, mode) {
    let result = [];

    for (let p of processes) {
        let index = -1;

        if (mode === "first") {
            for (let i = 0; i < blocks.length; i++)
                if (blocks[i] >= p) { index = i; break; }
        }

        if (mode === "best") {
            let best = Infinity;
            for (let i = 0; i < blocks.length; i++)
                if (blocks[i] >= p && blocks[i] < best) {
                    best = blocks[i];
                    index = i;
                }
        }

        if (mode === "worst") {
            let worst = -1;
            for (let i = 0; i < blocks.length; i++)
                if (blocks[i] >= p && blocks[i] > worst) {
                    worst = blocks[i];
                    index = i;
                }
        }

        if (index === -1) {
            result.push([p + " KB", "Not Allocated", "-", "-"]);
        } else {
            result.push([
                p + " KB",
                "Block " + (index + 1),
                blocks[index] + " KB",
                (blocks[index] - p) + " KB"
            ]);
            blocks[index] -= p;
        }
    }

    return result;
}

function createTable(title, data) {
    let html = `<h2 class="table-title">${title}</h2>`;
    html += `<table>
                <tr>
                    <th>Process</th>
                    <th>Block Allocated</th>
                    <th>Block Size</th>
                    <th>Remaining</th>
                </tr>`;

    data.forEach(row => {
        html += "<tr>";
        row.forEach(col => html += `<td>${col}</td>`);
        html += "</tr>";
    });

    html += "</table>";
    return html;
}

function runSimulation() {
    let blocks = parseInput("blocks");
    let processes = parseInput("processes");

    if (blocks.length === 0 || processes.length === 0) {
        alert("Please enter valid numbers for blocks and processes.");
        return;
    }

    let ff = allocate([...blocks], processes, "first");
    let bf = allocate([...blocks], processes, "best");
    let wf = allocate([...blocks], processes, "worst");

    document.getElementById("results").innerHTML =
        createTable("First Fit", ff) +
        createTable("Best Fit", bf) +
        createTable("Worst Fit", wf);
}

function resetPage() {
    location.reload();
}
