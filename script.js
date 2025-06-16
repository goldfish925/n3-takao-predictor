
const wheel100 = "0123456789";
const wheel10 = "0741852963";
const wheel1 = "0987654321";

function toWheelIndex(numStr) {
  return [
    wheel100.indexOf(numStr[0]),
    wheel10.indexOf(numStr[1]),
    wheel1.indexOf(numStr[2])
  ];
}

function calcDiffs(indicesList) {
  const diffs = [];
  for (let i = 1; i < indicesList.length; i++) {
    const prev = indicesList[i - 1];
    const curr = indicesList[i];
    diffs.push([
      (curr[0] - prev[0] + 10) % 10,
      (curr[1] - prev[1] + 10) % 10,
      (curr[2] - prev[2] + 10) % 10
    ]);
  }
  return diffs;
}

function countDiffs(diffs) {
  const count = {};
  for (const diff of diffs) {
    const key = diff.join(",");
    count[key] = (count[key] || 0) + 1;
  }
  return count;
}

function topDiffs(count, topN = 3) {
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(entry => entry[0].split(",").map(Number));
}

function reconstructNumber(lastIndex, diff) {
  return [
    wheel100[(lastIndex[0] + diff[0]) % 10],
    wheel10[(lastIndex[1] + diff[1]) % 10],
    wheel1[(lastIndex[2] + diff[2]) % 10]
  ].join("");
}

document.getElementById("csvFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split("\n");
    const nums = lines
      .map(line => line.split(",")[2]) // 抽選数字列（3列目）
      .filter(n => n && /^\d{3}$/.test(n))
      .slice(-21); // 最新20件＋1件（差分用）

    const indices = nums.map(toWheelIndex);
    const diffs = calcDiffs(indices);
    const counts = countDiffs(diffs);
    const tops = topDiffs(counts, 3);

    const lastIndex = indices[indices.length - 1];
    const results = tops.map(diff => reconstructNumber(lastIndex, diff));

    const list = document.getElementById("recommendations");
    list.innerHTML = "";
    results.forEach(num => {
      const li = document.createElement("li");
      li.textContent = num;
      list.appendChild(li);
    });
  };
  reader.readAsText(file);
});
