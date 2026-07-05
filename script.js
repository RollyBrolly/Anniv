const anniversaryDate = new Date("2025-08-18T00:00:00");

function updateTimer() {
    const now = new Date();

    let years = now.getFullYear() - anniversaryDate.getFullYear();
    let months = now.getMonth() - anniversaryDate.getMonth();
    let days = now.getDate() - anniversaryDate.getDate();

    if (days < 0) {
        months--;

        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        anniversaryDate.getHours(),
        anniversaryDate.getMinutes(),
        anniversaryDate.getSeconds()
    );

    let diff = now - startOfToday;

    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff %= 1000 * 60 * 60;

    const minutes = Math.floor(diff / (1000 * 60));
    diff %= 1000 * 60;

    const seconds = Math.floor(diff / 1000);

    document.getElementById("years").textContent = years;
    document.getElementById("months").textContent = months;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

updateTimer();
setInterval(updateTimer, 1000);