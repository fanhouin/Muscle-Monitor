var people = [
    {
      name: 'Casper',
      like: '鍋燒意麵',
      age: 18
    },
    {
      name: 'Wang',
      like: '炒麵',
      age: 24
    },
    {
      name: 'Bobo',
      like: '蘿蔔泥',
      age: 1
    },
    {
      name: '滷蛋',
      like: '蘿蔔泥',
      age: 3
    }
  ];

var find2 = people.filter(function(item, index, array){
    return item.name == '滷蛋'
})

console.log(find2)