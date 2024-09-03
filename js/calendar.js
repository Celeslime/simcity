
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
const startDate = new Date(2024, 7, 26);
const endDate = new Date(2024, 8, 15+7);

// 创建活动
const activities = [];
// 竞赛
CompHref = {
    39: 'https://simcity-buildit.fandom.com/wiki/Mayor%27s_Pass_Season_39:_Ireland',
    40: 'https://simcity-buildit.fandom.com/wiki/Mayor%27s_Pass_Season_40:_Canc%C3%BAn',
    41: 'https://simcity-buildit.fandom.com/wiki/Mayor%27s_Pass_Season_41:_Cape_Town',
}
for(let i = 0; i < 8; i++) {
    activities.push({
        startDate: new Date(2024, 7, 7 + i*7),
        endDate: new Date(2024, 7, 12 + i*7),
        startTime: 12/24,
        endTime: 24/24,
        title: ((i%4+1)==4?'双倍':'')+'竞赛'+(i%4+1),
        class: 1,
        href: CompHref[Math.floor(i/4)+39],
        label: '市长竞赛'+(Math.floor(i/4)+39)+'期 第'+(i%4+1)+'周'
    });
}
// 设计
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 7, 23 + i*7),
        endDate: new Date(2024, 7, 25 + i*7),
        startTime: 16/24,
        endTime: 16/24,
        title: '设计'+(i*2+1),
        class: 2,
        href: 'https://simcity-buildit.fandom.com/wiki/Design_Challenges_Season_41',
        label: '设计挑战赛41赛季 第'+(i*2+1)+'期'
    });
}
for(let i = 0; i < 3; i++) {
    activities.push({
        startDate: new Date(2024, 7, 26 + i*7),
        endDate: new Date(2024, 7, 28 + i*7),
        startTime: 16/24,
        endTime: 16/24,
        title: '设计'+(i*2+2),
        class: 2,
        href: 'https://simcity-buildit.fandom.com/wiki/Design_Challenges_Season_41',
        label: '设计挑战赛41赛季 第'+(i*2+2)+'期'
    });
}
// 战争 60 = 12 + 36 + 12
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 7, 31 + i*5),
        endDate: new Date(2024, 7, 32 + i*5),
        startTime: 9/24,
        endTime: 21/24,
        title: '战争',
        class: 3
    })
}
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 8, 2 + i*5),
        endDate: new Date(2024, 8, 4 + i*5),
        startTime: 21/24,
        endTime: 9/24,
        title: '战争',
        class: 3
    })
}
// 市长委托
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 7, 29 + i*8),
        endDate: new Date(2024, 7, 32 + i*8),
        startTime: 0/24,
        endTime: 24/24,
        title: '市长委托',
        class: 4,
        label: '市长委托任务'
    })
}
// 史诗双倍
var epic = ['全部', '交通', '教育', '娱乐', '高山', '地标', '沙滩'];
for(let i = 0; i < 10; i++) {
    activities.push({
        startDate: new Date(2024, 7, 5 + i*7),
        endDate: new Date(2024, 7, 11+ i*7),
        startTime: 10/24,
        endTime: 10/24,
        title: epic[(i+3)%7]+'史诗',
        class: 5,
        label: epic[(i+3)%7]+'史诗点数双倍'
    })
}
// 累计消耗
for(let i = 0; i < 4; i++) {
    activities.push({
        startDate: new Date(2024, 8, 2 + i*7),
        endDate: new Date(2024, 8, 5 + i*7),
        startTime: 0/24,
        endTime: 24/24,
        title: '累计消耗',
        class: 6,
        label: '累计消耗绿钞'
    })
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
            let activity = document.createElement('a');
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
            if(activities[j].href != undefined) {
                activity.href = activities[j].href;
                activity.target = '_blank';
            }
            if(activities[j].label != undefined) {
                activity.title = activities[j].label;
            }
            else{
                activity.title = activities[j].title;
            }
            if(activities[j].startDate - i == 0) {
                activity.style.left = (activities[j].startTime * 100) + '%';
                activity.style.width = (100 - activities[j].startTime * 100) + '%';
                if((100 - activities[j].startTime * 100)< 50){
                    activity.textContent = "";
                }
                activity.classList.add('start');
            }
            if(activities[j].endDate - i == 0){
                activity.style.right = (100 - activities[j].endTime * 100) + '%';
                activity.style.width = (activities[j].endTime * 100) + '%';
                if(activities[j].endTime * 100 < 50){
                    activity.textContent = "";
                }
                activity.classList.add('end');
            }
            div.appendChild(activity);
        }
    }
    days.appendChild(div);
}

//空白格
const nextBlanks = (7 - endDate.getDay())%7;
for(let i = 0; i < nextBlanks; i++) {
    const div = document.createElement('div');
    days.appendChild(div);
}