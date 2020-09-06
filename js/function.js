const color = [
    "white",
    "greenyellow",
    "yellow",
    "lightcoral",
    "aquamarine",
];

// 游戏规格
var floor_size = { w: 8, h: 8 };
var cell_size = { w: 40, h: 40 };
// 创建一个二维数组, 并全赋值为0，要比规定范围大一圈
var floor = new Array(floor_size.h + 2);
for (var i = 0; i < floor_size.h + 2; i++) {
    floor[i] = new Array(floor_size.w + 2);
    for (var j = 0; j < floor_size.w + 2; j++) {
        floor[i][j] = 0;
    }
}

// 记录点击位置
var clicked_pos = null;
var is_clicked = false;

// 响应每个格子的点击事件，点击后格子变蓝
function clicked(a) {
    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < cells.length; i++) {
        cells[i].style.border = "1px solid white";
    }
    a.style.border = "1px solid blue";
    var coor = { x: a.getAttribute("data-x"), y: a.getAttribute("data-y") };
    coor.x = Number(coor.x);
    coor.y = Number(coor.y);
    if (is_clicked == false) {
        clicked_pos = coor;
        is_clicked = true;
    } else {
        if (clicked_pos.x == coor.x && clicked_pos.y == coor.y) {
            return 0;
        } else {
            judge(clicked_pos, coor);
            clicked_pos = coor;
        }
    }
}

// 自动生成 cell 的网格
window.onload = function() {
    var tmp_color = new this.Array(this.floor_size.w * this.floor_size.h);
    const pre_count = this.floor_size.w * this.floor_size.h / (color.length - 1);
    for (var i = 0; i < this.floor_size.w * this.floor_size.h; i++) {
        tmp_color[i] = this.Math.floor(i / pre_count) + 1;
    }

    tmp_color.sort(function(a, b) { return Math.random() > .5 ? -1 : 1; });
    var idx = 0;
    for (var i = 1; i <= this.floor_size.h; i++) {
        for (var j = 1; j <= this.floor_size.w; j++) {
            floor[i][j] = tmp_color[idx++];
        }
    }
    
    do {
        var is_lame = false;
        for (var i = 1; i <= this.floor_size.h - 1; i++) {
            for (var j = 1; j <= this.floor_size.w - 1; j++) {
                if (this.floor[i][j] == this.floor[i+1][j+1] && this.floor[i+1][j] == this.floor[i][j+1]) {
                    is_lame = true;
                    var x = Math.ceil(Math.random()*this.floor_size.h),
                        y = Math.ceil(Math.random()*this.floor_size.w);
                    var tmp = this.floor[i][j];
                    this.floor[i][j] = this.floor[x][y];
                    this.floor[x][y] = tmp;
                    break;
                }
            }
            if (is_lame) {
                break;
            }
        }
    }while (is_lame);
    

    delete tmp_color;

    var table = document.getElementById("table");

    for (var i = 0; i < floor_size.h + 2; i++) {
        // 添加一行
        var row = document.createElement("div");
        row.className = "row";
        for (var j = 0; j < floor_size.w + 2; j++) {
            // 往每一行添加cell
            var cell = document.createElement("div");
            cell.className = "cell";
            // 设置cell的坐标
            cell.setAttribute("data-x", i);
            cell.setAttribute("data-y", j);
            cell.style.backgroundColor = color[floor[i][j]]; // 设置单元格颜色
            if (i > 0 && i < floor_size.h + 1 && j > 0 && j < floor_size.w + 1) {   
                cell.setAttribute("onclick", "clicked(this)"); // 添加点击事件
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // 绘制在屏幕上
    var rows = document.getElementsByClassName('row');
    var cells = document.getElementsByClassName("cell");
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.width = (this.cell_size.w + 2) * (this.floor_size.w + 2) + "px";
        rows[i].style.height = this.cell_size.h + "px";
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].style.width = this.cell_size.w + "px";
        cells[i].style.height = this.cell_size.h + "px";
    }
}

function judge(from, to) {
        // 前提两块颜色相同
    if (floor[from.x][from.y] != floor[to.x][to.y]) {
        return;
    }
    var cells = document.getElementsByClassName("cell");
    var rows = document.getElementsByClassName('row');

    // 满足其中一种，消除这两块
    if (zero_corner(from, to) || one_corner(from, to) || two_corner(from, to)) {
        is_clicked = false;
        floor[from.x][from.y] = 0;
        floor[to.x][to.y] = 0;
        cells[Number((from.x) * (floor_size.w + 2)) + Number(from.y)].style.backgroundColor = color[floor[from.x][from.y]];
        cells[Number((to.x) * (floor_size.w + 2 )) + Number(to.y)].style.backgroundColor = color[floor[to.x][to.y]];
    }
}

function zero_corner(from, to) {
    // 前提在一条线上
    if (from.x == to.x || from.y == to.y) {
        // 找出相对左上的点
        var s = from,
            e = to;
        if (from.x > to.x) {
            s = to;
            e = from;
        }
        if (from.y > to.y) {
            s = to;
            e = from;
        }

        for (var i = Number(s.x) + 1; i < Number(e.x); i++) {
            if (floor[i][from.y]) {
                return false;
            }
        }

        for (var i = Number(s.y) + 1; i < Number(e.y); i++) {
            if (floor[from.x][i]) {
                return false;
            }
        }

        var cells = document.getElementsByClassName("cell");
        var s_div = cells[Number((s.x) * (floor_size.w + 2)) + Number(s.y)],
            e_div = cells[Number((e.x) * (floor_size.w + 2)) + Number(e.y)];

        s_div.style.border = "1px solid white";
        e_div.style.border = "1px solid whit";
        return true;
    }
    return false;
}



function one_corner(from, to) {
    var corner_one = { x: from.x, y: to.y };
    var corner_two = { x: to.x, y: from.y };
    console.log(floor[corner_one.x][corner_one.y]);
    console.log(floor[corner_two.x][corner_two.y]);
    if (floor[corner_one.x][corner_one.y] == 0 && zero_corner(from, corner_one) && zero_corner(to, corner_one)) {
        return true;
    }
    if (floor[corner_two.x][corner_two.y] == 0 && zero_corner(from, corner_two) && zero_corner(to, corner_two)) {
        return true;
    }

    return false;
}

function two_corner(from, to) {
    var tag1 = false,
        tag2 = false;
    var cells = document.getElementsByClassName("cell");

    // 往下走
    if (!tag1) {
        for (var i = from.x + 1; i < floor_size.h + 2; i++) {
            var tmp = {x: i, y: from.y};
            if (floor[tmp.x][tmp.y]) {
                break;
            }
            tag1 = one_corner(tmp, to);
            if (tag1) {
                break;g
            }
        }
    }

    // 往上走
    if (!tag1) {
        for (var i = from.x - 1; i >= 0; i--) {
            var tmp = {x: i, y: from.y};
            if (floor[tmp.x][tmp.y]) {
                break;
            }
            tag1 = one_corner(tmp, to);
            if (tag1) {
                break;
            }
        }
    }

    // 往右走
    if (!tag2) {
        for (var i = from.y + 1; i < floor_size.w + 2; i++) {
            var tmp = {x: from.x, y: i};
            if (floor[tmp.x][tmp.y]) {
                break;
            }
            tag2 = one_corner(tmp, to);
            if (tag2) {
                break;
            }
        }
    }
        
    // 往左走
    if (!tag2) {
        for (var i = from.y - 1; i >= 0; i--) {
            var tmp = {x: from.x, y: i};
            if (floor[tmp.x][tmp.y]) {
                break;
            }
            tag2 = one_corner(tmp, to);
            if (tag2) {
                break;
            }
        } 
    }

    if (tag1 || tag2) {
        return true;
    } else {
        return false;
    }
}
