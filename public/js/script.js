$(function(){
var recipes = [], 
    special = [],
  RecipeBook = function(){
  this.init();
};

RecipeBook.prototype = {
  init: function(){
    //add loader
    this.getData("recipes");
    this.getData("specials");
  },

  getData: function(type){
    const getJSON = async url => {
      try {
        const response = await fetch(url);
        if(!response.ok) 
          throw new Error(response.statusText);

        const data = await response.json(); 
        return data; 
      } catch(error) {
        return error;
      }
    }

    getJSON("http://localhost:3001/"+type).then(data => {
      if (type==="recipes"){
        this.cardRecipeTemplate(data);
      }else{
        special = data;
      }
    }).catch(error => {
      console.error(error);
    }); 
  },

  getItem: function(id){
    return recipes.filter(x => x.uuid === id).map(x => x.items)
  },

  cardRecipeTemplate: function(data){
    var html = '',
        col = 1;
    
    for (var i=0; i<data.length; i++){
      if (col === 1){
        html+=
        '<div class="row mt-3 mb-3">';
      }
      html +=
        '<div class="card col-4 p-0 m-0" data-uuid="'+data[i].uuid+'">' + 
          '<img class="card-img-top" src="'+data[i].images.full.replace(/^\/|\/$/g, '')+'" alt="'+data[i].title+'" style="height: 260px !important;">' +
          '<div class="card-body">' +
            '<h5 class="card-title">'+data[i].title+'</h5>' +
            '<p class="card-text">'+data[i].description+'</p>' +
            '<button type="button" class="btn btn-primary check-recipe" data-toggle="modal" data-target="#exampleModalLong" data-id="'+data[i].uuid+'">Check Recipe</button>' +
          '</div>' +
        '</div>';
      if (col === 3 || i === data.length){
        html+=
          '</div>';
        col=0;
      }
      col++;
      
      recipes.push({
        uuid: data[i].uuid,
        items: data[i]
      });    
    }
    $('#recipe-tab').html(html);
  },

  recipeBookPageTemplate: function(item){
    var html = 
      '<div class="row justify-content-center">' +
        '<img class="img-fluid mt-2 mb-2" src="'+item.images.full.replace(/^\/|\/$/g, '')+'" style="width: 50%;">' + 
        '<div class="col-10">' +
          '<div class="row" style="">' +
            '<div class="col text-center" style="border: 1px dashed #b5b5b5;">' +
              '<h4 class="mt-3 mb-0">'+item.servings+'</h4>' +
              '<h5>Servings</h5>' +
            '</div>' + 
            '<div class="col text-center" style="border: 1px dashed #b5b5b5;">' +
              '<h4 class="mt-3 mb-0">'+item.prepTime+'</h4>' +
              '<h5>Prep Time</h5>' +
            '</div>' + 
            '<div class="col text-center" style="border: 1px dashed #b5b5b5;">' +
              '<h4 class="mt-3 mb-0">'+item.cookTime+'</h4>' +
              '<h5>Cook Time</h5>' +
            '</div>' + 
          '</div>' + 
          '<div class="row mt-3">' + 
            '<div class="col-4 pl-0">' +
              '<div class="card">' +
                '<div class="card-header" id="headingOne">' +
                  '<h5 class="mb-0"> Ingredients</h5>' + 
                '</div>' + 
                '<div class="card-body p-0">' +
                  '<ul class="list-group">';
                  for (var i=0; i<item.ingredients.length; i++){
                    html+=
                    '<li class="list-group-item">'+item.ingredients[i].amount+' '+ item.ingredients[i].measurement+' of '+item.ingredients[i].name;
                    for (var j=0; j<special.length; j++){
                      if (item.ingredients[i].uuid === special[j].ingredientId){
                        html+= 
                        '<h6 class="mb-0 mt-2" style="font-size: .9em;">' +special[j].title+ '<span class="ml-2 badge badge-warning">'+special[j].type+'</span></h6>'+
                        '<p class="m-0" style="font-size: .9em;">'+ special[j].text+'</p>';
                      }
                    }
                    html+='</li>';
                  }
                  html+=
                  '</ul>' + 
                '</div>' + 
              '</div>' +
            '</div>' +

            '<div class="col-8 pr-0">' +
              '<div class="card">' +
                '<div class="card-header" id="headingOne">' +
                  '<h5 class="mb-0"> Directions</h5>' + 
                '</div>' + 
                '<div class="card-body p-0">' +
                  '<ul class="list-group">';
                  for (var i=0; i<item.directions.length; i++){
                    html+=
                      '<li class="list-group-item"><span class="h4">'+i+'</span>. &nbsp'+item.directions[i].instructions+ '</li>';
                  }
                  html+=
                  '</ul>' + 
                '</div>' + 
              '</div>' +
            '</div>' + //col-8 close
          '</div>' + 
        '</div>' +
      '</div>';  
      
      
      $('.modal-body').html(html);
      $('.modal-title').html(item.title);
      $('.modal-header p').html('Post Date: ' + item.postDate + ' | ' + 'Modified Date: ' + item.editDate);
  }
}

$(document)

.on('click', '.check-recipe', function(){
  var item = RecipeBook.prototype.getItem($(this).data('id'));
  RecipeBook.prototype.recipeBookPageTemplate(item[0]);
});

var recipe = new RecipeBook();
});


// add button/edit













