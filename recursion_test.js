resoo = []
puro0 = {}
puro0.p = true;
puro0

m0 = [
    [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ],
    [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ],
    [
      0, 0, 0, 0, 0,
      1, 0, 0, 0, 0
    ],
    [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ],
    [
      0, 0, 0, 0, 0,
      0, 0, 0, 3, 0
    ],
    [
      0, 0, 0, 0, 0,
      0, 3, 0, 0, 0
    ],
    [
      0, 0, 0, 0, 0,
      0, 3, 3, 3, 3
    ],
    [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ],
    [
      0, 4, 0, 0, 0,
      0, 4, 0, 0, 0
    ],
    [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]
  ];
m0
checkAd(6, 7, m0, resoo,  puro0) //qui si possono cambiare le coordinate
if(puro0.p){
    resoo.forEach((e, i) => {
        m0[e[0]][e[1]] = 4;
    });
}
console.log(m0)
resoo
puro0

function checkAd(i, j, m, reso, puro){
    //console.log(m[i]);
    console.log(m[i][j])
    if(m[i][j] == 0 || m[i][j] == 1 ||  m[i][j] == 4 ){
        return;
    }
    if(m[i][j] == 2){
        puro.p = false;
        return;
    }
    if(m[i][j] == 3){
        reso.push("" + i + j);
        //return;
    }
    console.log(!reso.includes("" + i + j))
    if(checkCell(i + 1, j) && !reso.includes("" + (i + 1) + j)){
        console.log("" + (i + 1) + j)
        checkAd(i + 1, j, m, reso, puro);
    }
    if(checkCell(i, j - 1) && !reso.includes("" + i + (j - 1))){
        console.log("" + i + (j - 1))
        checkAd(i, j - 1, m, reso, puro);
    }
    if(checkCell(i - 1, j) && !reso.includes("" + (i - 1) + j)){
        console.log("" + (i - 1) + j)
        checkAd(i - 1, j, m, reso, puro);
    }
    if(checkCell(i, j + 1) && !reso.includes("" + i + (j + 1))){
        console.log("" + i + (j + 1))
        checkAd(i, j + 1, m, reso, puro);
    }
}

function checkCell(x, y){
    console.log(x, y)
    if(x >= 0 && x < 10 && y >= 0 && y < 10){
        return true;
    }
    return false;
}