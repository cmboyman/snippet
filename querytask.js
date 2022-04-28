//------------------------------------Open Window for Update Record Filter----------------------------//

var toolbar = function (layer) {
   return {
      // batch "1" is visible initially
      view: "toolbar", type: "clean",
      id: `tbar${layer}`,
      visibleBatch: "Choose next Operation",
      cols: [
         {
            // view: "button",
            // value: "save",
            batch: "Choose next Operation",
         },
         {
            view: "richselect",
            batch: "Pluck",
            label: 'Field:',
            //value: 1,
            options: [
               { id: 1, value: "One" },
               { id: 2, value: "Two" },
               { id: 3, value: "Three" }
            ],
            on: {
               onChange: function (value) {
                  // passes in what the user selected
                  // add a new field
                  rebuildField({ source: `group${layer + 1}`, pluckedVal: value, layer: layer + 1 })
               }
            }
         },
         {
            view: "text",
            label: "Name",
            name: "name",
            placeholder: "Type here..",
            width: 440,
            batch: "Save",
            label: "Variable:"
         },
         {
            view: "button",
            label: "Update Popout",
            click: function () {
               updatePopout().show();
            },
            batch: "Update Record",
         },
         { batch: "Update Record" }
      ]
   }
};
var selectOperationRow = function (layer, parent = null,) {
   return {
      rows: [{
         padding: 10,
         id: `group${layer}`,
         type: "clean",
         cols: [
            {
               view: "select",
               id: `opVal${layer}`,
               vertical: true,
               width: 250,
               label: "Select",
               value: "Choose next Operation",
               options: ["Pluck", "Update Record", "Choose next Operation", "Save"],
               on: {
                  onChange: function (value) { // passes in what the user selected
                     var mode = $$(`opVal${layer}`)?.getValue();
                     if (value)
                        $$(`tbar${layer}`)?.showBatch(value);
                  }
               }
            },
            {
               type: "clean", cols: [
                  toolbar(layer),
                  {
                     view: "icon",
                     icon: "wxi-trash",
                     click: function () {
                        // reset the field
                        rebuildField({ source: `group${layer}`, layer: layer })
                        let toRemove = this.getParentView();
                        // console.log($$(`group${layer}`))
                        // console.log($$(`group${layer+1}`))
                        $$(`tbar${layer}`).removeView($$(`tbar${layer}`))
                        $$(`group${layer}`).removeView($$(`opVal${layer}`))
                     },
                  },
               ]
            }
         ]
      },
      {
         id: `group${layer + 1}`, hidden: true, cols: []
      }
      ]
   }
}

var fieldUpdateOptions = function (field) {
   return {
      // batch "1" is visible initially
      view: "toolbar", type: "clean",
      id: `updateOption${field}`,
      visibleBatch: "Choose next Operation",
      cols: [
         {
            view: "text",
            label: "Custom",
            name: "Custom",
            placeholder: "Type here..",
            // width: 440,
            batch: "Custom",
            // label: "Custom value:"
         },
         {
            view: "text",
            label: "Script",
            name: "Script",
            placeholder: "Code here..",
            // width: 440,
            batch: "Script",
            // label: "Custom value:"
         },
         {
            view: "richselect",
            batch: "From Process",
            // label: 'Field:',
            //value: 1,
            options: [
               { id: 1, value: "One" },
               { id: 2, value: "Two" },
               { id: 3, value: "Three" }
            ]
         },
      ]
   }
};

var fieldUpdateSelector = function (field) {
   return {
      cols: [
         {
            view: "select",
            id: `updateType${field}`,
            vertical: true,
            width: 100,
            label: "Select",
            value: "Custom",
            options: ["Custom", "Script", "From Process"],
            on: {
               onChange: function (value) { 
                  // Update options to match what the user selected
                  if (value)
                     $$(`updateOption${field}`)?.showBatch(value);
               }
            }
         },
         {
            type: "clean", cols: [
               // show the options
               fieldUpdateOptions(field),
            ]
         }
      ]
   }
}
var updatePopout = function(data) {
   data = data || selectData1;
   return webix.ui({
   view: 'window',
   modal: true,
   position: 'top',
   width: 600,
   height: 800,
   close: true,
   css: "mywin",
   head: "Filter",
   body: {
      view: 'form',
      id: "update_form",
      elements: [
         {
            cols: [
               {
                  view: "select", label: "set", name: "set", 
                  options: data.options,
                  // options: [
                  //    { value: "one" },
                  //    { value: "two" },
                  //    { value: "three" },
                  //    { value: "four" },
                  // ], 
                  width: 250,
                  on: {
                     c: function (newValue, oldValue) { 
                        // Update fieldUpdateSelector to match what the user selected
                        if (newValue)
                           $$(`updateType${oldValue}`)?.removeView(value);
                           this.getParentView().addView(fieldUpdateSelector(value))
                     }
                  }
               },
               //
               fieldUpdateSelector(data.options[0], data.options),
               // add new fields to update
               {
                  view: "button", label: '' +
                     '<font size="5px"><i class="fa-solid fa-circle-plus" aria-hidden="true"></i></font>',
                  click: function () {
                     $$('update_form').addView({
                        view: 'layout',
                        cols: [
                           {
                              view: "select", label: "set", name: "set", width: 250, align: "center",
                              options: [
                                 { value: "one" },
                                 { value: "two" },
                                 { value: "three" },
                                 { value: "four" },
                              ], width: 250
                           },
                           { view: "text", label: "to", name: "to", width: 250, align: "center" },
                           {
                              view: "icon", icon: "wxi-trash",
                              click: function () {
                                 let toRemove = this.getParentView();
                                 this.getParentView().getParentView().removeView(toRemove)
                              }
                           }
                        ]
                     }, 1)
                  }
               }
            ]
         },
         {
            margin: 5, cols: [
               {},

               {
                  view: "button", value: "Save", css: "webix_primary",
                  click: function () {
                     this.getParentView().getParentView().getParentView().hide();
                  }
               },
               {
                  view: "button", value: "Cancel",
                  click: function () {
                     this.getParentView().getParentView().getParentView().hide();
                  }

               },
               {}
            ]
         }
      ]
   }
});
}
//----------------------------------Pluck window----------------------//
var pluckWin = webix.ui({
   view: 'window',
   modal: true,
   position: 'top',
   width: 600,
   height: 800,
   close: true,
   css: "mywin",
   head: "Pluck Window",
   body: {
      view: 'form',
      id: "pluck_form",
      elements: [
         {
            cols: [
               {
                  view: "select", label: "Fields", name: "Fields", options: [
                     { value: "one" },
                     { value: "two" },
                     { value: "three" },
                     { value: "four" },
                  ], width: 250
               },
               { view: "text", label: "Save", name: "Save", width: 250, align: "center" },
               {
                  view: "button", label: '' +
                     '<font size="5px"><i class="fa-solid fa-circle-plus" aria-hidden="true"></i></font>',
                  click: function () {
                     $$('pluck_form').addView({
                        view: 'layout',
                        cols: [
                           {
                              view: "select", label: "Fields", name: "Fields", width: 250, align: "center",
                              options: [
                                 { value: "one" },
                                 { value: "two" },
                                 { value: "three" },
                                 { value: "four" },
                              ], width: 250

                           },
                           { view: "text", label: "Save", name: "Save", width: 250, align: "center" },
                           {
                              view: "icon", icon: "wxi-trash",
                              click: function () {
                                 let toRemove = this.getParentView();
                                 this.getParentView().getParentView().removeView(toRemove)
                              }
                           }
                        ]

                     }, 1)

                  }
               }


            ]



         },
         {
            margin: 5, cols: [
               {},

               {
                  view: "button", value: "Save", css: "webix_primary",
                  click: function () {
                     pluckWin.hide();
                  }
               },
               {
                  view: "button", value: "Cancel",
                  click: function () {
                     pluckWin.hide();
                  }

               },
               {}
            ]
         }
      ]
   }
})



var selectData1 = {
   view: "select", id: "select1", name: "select1", label: "Objects",
   options: [
      { value: "Currency" },
      { value: "Expense Source" },
      { value: "Ministry Team" },
      { value: "Country" },
      { value: "Expense Subcategory" },
      { value: "Journal" },
      { value: "Languages" },
      { value: "Fiscal Month" },
      { value: "Donation " },
      { value: "Default Settings" },
      { value: "Report Item" },
      { value: "Dashboard Data" },
      { value: "Feedback" },
      { value: "QX Center" },
      { value: "Entity" },
      { value: "del" },
      { value: "Receipt" },
      { value: "Project Funding" },
      { value: "Role" },
      { value: "City" },
      { value: "Expense Report" },
      { value: "Social Media" },
      { value: "Family" },
      { value: "(?)Staff Donation" },
      { value: "Insurance Information" },
      { value: "Grades" },
      { value: "Fiscal Year" },
      { value: "Income Source" },
      { value: "Team Assignments (key)" },
      { value: "Project - Budgeting" },
      { value: "Phone" },
      { value: "Journal Entry" },
      { value: "Donor Team" },
      { value: "Grades" },
      { value: "Address" },
      { value: "System Check" },
      { value: "Advance" },
      { value: "Usable Balance" },
      { value: "Donor" },
      { value: "Account" },
      { value: "Emergency Contact" },
      { value: "Worker Information" },
      { value: "Email" },
      { value: "JE Archive" },
      { value: "Scope" },
      { value: "HR team link (key)" },
      { value: "Project Income" },
      { value: "Year" },
      { value: "Team" },
      { value: "Platform" },
      { value: "Balance" },
      { value: "Account - COA" },
      { value: "Role" },
      { value: "Responsibility Center" },
      { value: "Exchange Rate" },
      { value: "Leave Request" },
      { value: "Course" },
      { value: "MCC" },
      { value: "Team Assignments" },
      { value: "Person - Profile" },
      { value: "Leave Request 2" },
      { value: "Cash Account" },
      { value: "Account Transfer" },
      { value: "User Leave" },
      { value: "Year del me" },
      { value: "Project Expense" },
      { value: "Expense" },
      { value: "Budget" },
      { value: "Batch" },
      { value: "Moderator" },
      { value: "IE Category" }

   ],
   on: {
      onChange: function (newv, oldv, config) {

      }
   }

};



//------------------Select List------------------------//
var selectlist = {
   view: "select", id: "select2", name: "select2", label: "Select", value: "choose next operation",
   options: [
      { value: "choose next operation" },
      { value: "update record" },
      { value: "pluck" },
      { value: "save" },
   ], width: 500,
   /*
 on:{
   onChange: function(newv,oldv,config){
         if(newv=="pluck")
      
         if(newv=="update record")
         //  webix.message(newv);
             winUpdate.show();	
        if(newv=="save")
           webix.message("Save");     
   }
 }*/
};


var form1 = {
   view: "form", id: "main",
   rows: [
      { view: "text", value: 'example', name: "tname", label: "*Name" },
      selectData1, selectOperationRow(0),
   ]

};

//----------------------------------------------------------------//

function rebuildField(formData) {
   webix.ui(
      selectOperationRow(formData.layer)
      , $$(formData.source));
}

// webix.ui({

//    view: "form",
//    id: "root_form",

//    rows: [
//       selectOperationRow(0),
//    ],
//    on: {
//       onChange: function (value) { // passes in what the user selected
//          // var mode = $$(`opVal${layer}`)?.getValue();
//          // if (value)
//          //  $$(`tbar${layer}`)?.showBatch(value);
//       }
//    }
// });
webix.ui({
   id: "log_form",
   rows: [
      form1,
      {
         view: 'layout', id: "d1", hidden: true,
         cols: [

            { view: "text", label: "set", name: "set", width: 250, align: "center" },

            { view: "text", label: "to", name: "to", width: 250, align: "center" },

            {
               view: "icon", icon: "wxi-trash",

               click: function () {

                  let toRemove = this.getParentView();

                  this.getParentView().getParentView().removeView(toRemove)

               }

            },
         ]
      },
      {
         margin: 5, cols: [
            {},

            {
               view: "button", value: "OK", css: "webix_primary",
               click: function () {
                  var check_select = $$("select2").getValue();
                  if (check_select == "update record")
                     updatePopout().show();
                  if (check_select == "pluck")
                     pluckWin.show();
               }
            },
            { view: "button", value: "Cancel" },
            {}
         ]
      }

   ]
});