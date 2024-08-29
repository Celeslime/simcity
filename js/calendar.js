
// 获取当前日期
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const date = now.getDate();
const day = now.getDay();

// 创建日历
const calendar = document.getElementById('calendar');
const weekdays = document.getElementById('weekdays');
const days = document.getElementById('days');

const wkd = ['一','二','三','四','五','六','日'];
wkd.forEach((dayName, index) => {
    const div = document.createElement('div');
    div.textContent = dayName;
    if((day+6)%7 == index) {
        div.classList.add('today');
    }
    weekdays.appendChild(div);
});

// 日期范围
const startDate = new Date(2024, 7, 7);
const endDate = new Date(2024, 8, 16);

// 创建活动
const activities = [];
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 7, 7 + i*7),
        endDate: new Date(2024, 7, 12 + i*7),
        startTime: 12/24,
        endTime: 24/24,
        title: '竞赛'+(i+1),
        class: 1
    });
}
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 7, 24 + i*7),
        endDate: new Date(2024, 7, 26 + i*7),
        startTime: 16/24,
        endTime: 16/24,
        title: '设计'+(i*2+1),
        class: 2
    });
}
for(let i = 0; i < 3; i++) {
    activities.push({
        startDate: new Date(2024, 7, 27 + i*7),
        endDate: new Date(2024, 7, 29 + i*7),
        startTime: 16/24,
        endTime: 16/24,
        title: '设计'+(i*2+2),
        class: 2
    });
}

// 空白格
const blanks = startDate.getDay() - 1;
for(let i = 0; i < blanks; i++) {
    const div = document.createElement('div');
    days.appendChild(div);
}

// 日期
for(let i = startDate; i <= endDate; i = new Date(i.getTime() + 24 * 60 * 60 * 1000)) {
    const div = document.createElement('div');
    div.textContent = i.getDate();
    if(now.getDate() == i.getDate() && now.getMonth() == i.getMonth()){
        div.classList.add('today');
    }
    if(i === startDate || i.getDate() === 1) {
        div.classList.add('start');
        div.textContent = i.getMonth() + 1 + '/' + i.getDate();
    }
    let occupiedID = [];
    for(let j = 0; j < activities.length; j++) {
        if(activities[j].startDate <= i && activities[j].endDate >= i) {
            if(activities[j].id != undefined){
                occupiedID.push(activities[j].id);
            }
        }
    }
    for(let j = 0; j < activities.length; j++) {
        if(activities[j].startDate <= i && activities[j].endDate >= i) {
            let activity = document.createElement('div');
            activity.textContent = activities[j].title;
            if(activities[j].id == undefined){
                for(let k = 0;; k++) {
                    if(!occupiedID.includes(k)) {
                        activities[j].id = k;
                        occupiedID.push(k);
                        break;
                    }
                }
            }
            activity.style.top = (15+activities[j].id*15) + 'px';
            activity.classList.add('act'+activities[j].class);
            if(activities[j].startDate - i == 0) {
                activity.style.left = (activities[j].startTime * 100) + '%';
                activity.style.width = (100 - activities[j].startTime * 100) + '%';
                activity.classList.add('start');
            }
            if(activities[j].endDate - i == 0){
                activity.style.right = (100 - activities[j].endTime * 100) + '%';
                activity.style.width = (activities[j].endTime * 100) + '%';
                activity.classList.add('end');
            }
            div.appendChild(activity);
        }
    }
    days.appendChild(div);
}

//空白格
const nextBlanks = 7 - endDate.getDay();
for(let i = 0; i < nextBlanks; i++) {
    const div = document.createElement('div');
    days.appendChild(div);
}