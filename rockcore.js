// wrap all our code in a viewloaded function... which will repeadetly check if view is loaded before running page
var checkLoaded = setInterval(function() {
    // if view is loaded run this page, else try again every 100ms
    if (app.view) {
        viewloaded();
        clearInterval(checkLoaded);
        console.log("Loading Project Javascript: Success!");
    } else {
        console.log("Loading Project Javascript: View not ready. Trying again...");
    }
}, 100); // check every 100ms
var viewloaded = function() {


    require([

        "esri/Map",
        "esri/widgets/LayerList",
        "esri/widgets/Legend",
        "esri/widgets/Search",
        "esri/Graphic",
        "dojo/query",
        "esri/layers/MapImageLayer",
        "esri/layers/FeatureLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/tasks/QueryTask",
        "esri/tasks/support/Query",
        "esri/layers/support/LabelClass",
        "esri/core/watchUtils",
        "esri/tasks/support/RelationshipQuery",
        "dojo/_base/declare",
        "dojo/request",
        "dstore/Memory",
        "dojo/data/ObjectStore",
        "dojo/data/ItemFileReadStore",
        "dojox/grid/DataGrid",
        "dgrid/OnDemandGrid",
        "dgrid/Selection",
        "dgrid/List",
        "dojox/math/round",
        "dojo/query",
        "dojo/on",
        "dojo/dom",
        "dojo/domReady!",
        "dojo/dom-construct"


    ], function(Map, LayerList, Legend, Search, Graphic, query, MapImageLayer, FeatureLayer, SimpleMarkerSymbol, GraphicsLayer, Graphic, QueryTask, Query, LabelClass, watchUtils, RelationshipQuery, declare, request, Memory, ObjectStore, ItemFileReadStore, DataGrid, OnDemandGrid, Selection, List, mathRound, query, on, dom, domConstruct) {

        var resultsArray = null;
        var ifItExists;
        var click;
        var wellsUrl = "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/UCRC_Database_App_View/FeatureServer/0";
        //https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/UCRC_Database_App_View/FeatureServer/0



        var rockcore = new FeatureLayer({
            url: wellsUrl,
            title: "Well Locations",
            visible: true,
            outFields: ["*"],
            popupTemplate: {
                title: "Well Information",
                featureNavigationEnabled: true,
                //actions: [corePhotos],
                content: "{UWI:createClickContentWells}{Well_Name:createClickContentWells}{OPERATOR:createClickContentWells}{County_Long:createClickContentWells}{PURPOSE:createClickContentWells}{GL:createClickContentWells}{FORM_TD:createClickContentWells}{PROD_FORM:createClickContentWells}{Cored_Formation:createClickContentWells}{FIELD_NAME:createClickContentWells}{Notes:createClickContentWells}{Latitude:createClickContentWells}{Longitude:createClickContentWells}{Easting:createClickContentWells}{Northing:createClickContentWells}{TWN:createClickContentWells}{RNG:createClickContentWells}{Section:createClickContentWells}"
            },
            showRelatedRecords: true,
            //maxScale: 2000000,
            legendEnabled: true
        });


        var highlightSymbol = {
            type: "simple-line", // autocasts as SimpleLineSymbol()
            color: [154, 55, 0],
            width: 1
        };

        // $("#info-div").click( function(event) {
        //   event.stopPropagation();
        //   $("#layer-select").show();
        // });
        // $(document).click( function() {
        //   $("#layer-select").hide();
        // });


        // $(document).ready(function(){
        //     $('#info-div').on('click', function(event) {
        //          $('#layer-select').toggle('show');
        //     });
        // });



        // show or hide any open calicite panels when user clicks for attribute details
        function showHideCalcitePanels(showPanel, showCollapse) {
            // hide all windows
            //query(".panel-collapse").query(".panel .in").collapse("hide");   //close any open panels
            query(".panel.in").removeClass("in"); //close any open panels
            query(".panel-collapse").removeClass("in");

            // if specified show this calcite panel
            if (showPanel) {
                //query(showPanel).query(showCollapse).addClass("in");
                query(showPanel).collapse("show"); // so I use these instead
                query(showCollapse).collapse("show");
            }
        }

                          // function that will filter by the selected core type
                          function showTypes(evt) {

                            // retrieve the query stored in the selected value
                            var typeQuery = evt.target.value;
                            //console.log(typeQuery);
        
                            // update the definition expression of well location layer
                            app.view.map.layers.forEach(function(layer) {
                              //console.log(layer);
                              if (layer.title === "Well Locations") {
                                //ayer.definitionExpression = "TYPE = '" + typeQuery + "'";
                                layer.definitionExpression = typeQuery;
                              }
                            });
                          }
                          on(dom.byId("layer-select"), "change", showTypes);

//         document.getElementById("All").addEventListener("click", function(){
//                 console.log("All");
//                     rockcore.definitionExpression = "1=1";       
//   })

//   document.getElementById("Core").addEventListener("click", function(){
//         console.log("Core");
//             rockcore.definitionExpression = "TYPE LIKE 'CORE' OR TYPE LIKE '%CORE,%' OR TYPE LIKE '%,CORE' OR TYPE LIKE 'BUTTS' OR TYPE LIKE '%BUTTS,%' OR TYPE LIKE '%,BUTTS' OR TYPE LIKE 'SLABS' OR TYPE LIKE '%SLABS,%' OR TYPE LIKE '%,SLABS' OR TYPE LIKE 'SKELETONIZED CORE' OR TYPE LIKE '%SKELETONIZED CORE,%' OR TYPE LIKE '%,SKELETONIZED CORE'";
// })

// document.getElementById("Cuttings").addEventListener("click", function(){
//     console.log("Cuttings");
//         rockcore.definitionExpression = "TYPE LIKE 'CUTTINGS' OR TYPE LIKE '%CUTTINGS,%' OR TYPE LIKE '%,CUTTINGS%' OR TYPE LIKE 'CHIPS' OR TYPE LIKE '%CHIPS,%' OR TYPE LIKE '%,CHIPS%' OR TYPE LIKE 'CORE CHIPS' OR TYPE LIKE '%CORE CHIPS,%' OR TYPE LIKE '%,CORE CHIPS%'";
// })

// document.getElementById("Other").addEventListener("click", function(){
//     console.log("Other");
//         rockcore.definitionExpression = "TYPE LIKE 'OUTCROP SAMPLES' OR TYPE LIKE '%OUTCROP SAMPLES,%' OR TYPE LIKE '%,OUTCROP SAMPLES' OR TYPE LIKE 'SIDEWALL' OR TYPE LIKE '%SIDEWALL,%' OR TYPE LIKE '%,SIDEWALL' OR TYPE LIKE 'SAMPLE' OR TYPE LIKE '%SAMPLE,%' OR TYPE LIKE '%,SAMPLE' OR TYPE LIKE 'OIL SAMPLES' OR TYPE LIKE '%OIL SAMPLES,%' OR TYPE LIKE '%,OIL SAMPLES'OR TYPE LIKE 'DISPLAY' OR TYPE LIKE '%DISPLAY,%' OR TYPE LIKE '%,DISPLAY'";
// })

// document.getElementById("Photos").addEventListener("click", function(){
//     console.log("Photos");
//         rockcore.definitionExpression = "Photographs LIKE 'YES'";
// })


app.view.popup.featureNavigationEnabled = true;



        function createClickContentThin(featureSetThin) {
            var contentThin = "";
            var att = featureSetThin.graphic.attributes;


            if (att.UWI != null) {
                contentThin += "<span class='bold' title='UWI'><b>UWI: </b></span>" + att.UWI + "<br />";
            }
            if (att.API != null) {
                contentThin += "<span class='bold' title='API Well Number'><b>API Well Number: </b></span>" + att.API + "<br />";
            }
            if (att.DOGM_Operator != null) {
                contentThin += "<span class='bold' title='DOGM Operator'><b>DOGM Operator: </b></span>" + att.DOGM_Operator + "<br />";
            }
            if (att.DOGM_Well_Name != null) {
                contentThin += "<span class='bold' title='Well Name'><b>DOGM Well Name: </b></span>" + att.DOGM_Well_Name + "<br />";
            }
            if (att.TS_Type != null) {
                contentThin += "<span class='bold' title=''><b>Thin Section Type: </b></span>" + att.TS_Type + "<br />";
            }
            if (att.Sample_Number != null) {
                contentThin += "<span class='bold' title='Sample Number'><b>Sample Number: </b></span>" + att.Sample_Number + "<br />";
            }
            if (att.Depth != null) {
                contentThin += "<span class='bold' title='Depth'><b>Depth: </b></span>" + att.Depth + "<br />";
            }
            if (att.Collection_Site != null) {
                contentThin += "<span class='bold' title=''><b>Collection Site: </b></span>" + att.Collection_Site + "<br />";
            }
            if (att.Formation != null) {
                contentThin += "<span class='bold' title=''><b>Formation: </b></span>" + att.Formation + "<br />";
            }
            if (att.TS_Notes != null) {
                contentThin += "<span class='bold' title=''><b>Notes: </b></span>" + att.TS_Notes + "<br />";
            }
            if (att.Box_Number != null) {
                contentThin += "<span class='bold' title=''><b>Box Number: </b></span>" + att.Box_Number + "<br />";
            }
            return contentThin;


        }


        createClickContentWells = function(value, key, data) {
            content = "";

            //console.log(data);
            //console.log(key);
            //console.log(value);

            wellPurpose = data.PURPOSE;
            wellPurposeFull = "";
            if (wellPurpose == "OG") {
                wellPurposeFull = "Oil and Gas";
            } else if (wellPurpose == "C") {
                wellPurposeFull = "Coal";
            } else if (wellPurpose == "M") {
                wellPurposeFull = "Mining";
            } else if (wellPurpose == "R") {
                wellPurposeFull = "Research";
            } else if (wellPurpose == "S") {
                wellPurposeFull = "Stratigraphic";
            } else if (wellPurpose == "T") {
                wellPurposeFull = "Tar";
            } else if (wellPurpose == "W") {
                wellPurposeFull = "Water";
            } else if (wellPurpose == "X") {
                wellPurposeFull = "Potash or Brine";
            } else if (wellPurpose == "B") {
                wellPurposeFull = "Buildings/Construction";
            };

        if (key === "UWI") {
            if (data.UWI) {
                content += "<span class='bold' title='Unique well-identification number'><b>API: </b></span>" + data.UWI + "</span><br />";
            }
        }
        if (key === "Well_Name") {
            if (data.Well_Name) {
                content += "<span class='bold' title='Well&#39;s common name'><b>Well Name: </b></span>" + data.Well_Name + "<br/>";
            }
        }
        if (key === "OPERATOR") {
            if (data.OPERATOR) {
                content += "<span class='bold' title='Well&#39;s operator'><b>Operator: </b></span>" + data.OPERATOR + "<br/>";
            }
        }
        if (key === "Count_Long") {
            if (data.County_Long) {
                content += "<span class='bold' title='Well&#39;s location'><b>County, State: </b></span>" + data.County_Long + ", " + data.State + "<br />";
            }
        }
        if (key === "PURPOSE") {
            if (data.PURPOSE) {
                content += "<span class='bold' title='Well&#39;s purpose'><b>Purpose: </b></span>" + wellPurposeFull + "<br />";
            }
        }
        if (key === "GL") {
            if (data.GL) {
                content += "<span class='bold' title='Well&#39;s ground level elevation'><b>Ground Level: </b></span>" + data.GL + " ft<br />";
            }
        }
        if (key === "FORM_TD") {
            if (data.FORM_TD) {
                content += "<span class='bold' title='Geologic formation at well&#39;s bottom'><b>Formation at TD: </b></span>" + data.FORM_TD + "<br />";
            }
        }
        if (key === "PROD_FORM") {
            if (data.PROD_FORM) {
                content += "<span class='bold' title='Name of producing geologic formation'><b>Producing Formation: </b></span>" + data.PROD_FORM + "<br />";
            }
        }
        if (key === "Cored_Formation") {
            if (data.Cored_Formation) {
                content += "<span class='bold' title='Name of cored geologic formation'><b>Cored Formation: </b></span>" + data.Cored_Formation + "<br />";
            }
        }
        if (key === "FIELD_NAME") {
            if (data.FIELD_NAME) {
                content += "<span class='bold' title='Name of producing geologic formation'><b>Oil-Gas Field: </b></span>" + data.FIELD_NAME + "<br />";
            }
        }
        if (key === "Notes") {
            if (data.Notes) {
                content += "<span class='bold' title='Notes about well/sample'><b>Notes: </b></span>" + data.Notes + "<br />";
            }
        }
        if (key === "Latitude") {
            if (data.Latitude) {
                content += "<span class='bold' title='Well&#39;s latitude'><b>Latitude: </b></span>" + parseFloat(data.Latitude).toFixed(4) + "&deg;<br />";
            }
        }
        if (key === "Longitude") {
            if (data.Longitude) {
                content += "<span class='bold' title='Well&#39;s longitude'><b>Longitude: </b></span>" + parseFloat(data.Longitude).toFixed(4) + "&deg;<br />";
            }
        }
        if (key === "Easting") {
            if (data.Easting) {
                content += "<span class='bold' title='Well&#39;s easting in NAD83'><b>Easting (NAD83): </b></span>" + parseFloat(data.Easting).toFixed(0) + " m <br />";
            }
        }
        if (key === "Northing") {
            if (data.Northing) {
                content += "<span class='bold' title='Well&#39;s easting in NAD83'><b>Northing (NAD83): </b></span>" + parseFloat(data.Northing).toFixed(0) + " m <br />";
            }
        }
        if (key === "TWN") {
            if (data.TWN) {
                content += "<span class='bold' title='Well&#39;s township'><b>Township: </b></span>" + data.TWN + "<br />";
            }
        }
        if (key === "RNG") {
            if (data.RNG) {
                content += "<span class='bold' title='Well&#39;s range'><b>Range: </b></span>" + data.RNG + "<br />";
            }
        }
        if (key === "Section") {
            if (data.Section) {
                content += "<span class='bold' title='Well&#39;s section'><b>Section: </b></span>" + data.Section + "<br />";
            }
        }
        if (key === "relationships/0/Notes") {
            content += "<span class='bold' title='Well&#39;s section'><b>Poop: </b></span>POOP<br />";
        }

            return content; //This is required if passing information to another function
        }


        // function createClickContentWells2(featureSetWells) {
        //     content = "";

        //     console.log(featureSetWells);

        //     var att = featureSetWells.graphic.attributes;
        //     wellPurpose = att.PURPOSE;
        //     wellPurposeFull = "";
        //     if (wellPurpose == "OG") {
        //         wellPurposeFull = "Oil and Gas";
        //     } else if (wellPurpose == "C") {
        //         wellPurposeFull = "Coal";
        //     } else if (wellPurpose == "M") {
        //         wellPurposeFull = "Mining";
        //     } else if (wellPurpose == "R") {
        //         wellPurposeFull = "Research";
        //     } else if (wellPurpose == "S") {
        //         wellPurposeFull = "Stratigraphic";
        //     } else if (wellPurpose == "T") {
        //         wellPurposeFull = "Tar";
        //     } else if (wellPurpose == "W") {
        //         wellPurposeFull = "Water";
        //     } else if (wellPurpose == "X") {
        //         wellPurposeFull = "Potash or Brine";
        //     } else if (wellPurpose == "B") {
        //         wellPurposeFull = "Buildings/Construction";
        //     };

        //     if (att.UWI != null) {
        //         content += "<span class='bold' title='Unique well-identification number'><b>API: </b></span>" + att.UWI + "</span><br />";
        //     }
        //     if (att.Well_Name != null) {
        //         content += "<span class='bold' title='Well&#39;s common name'><b>Well Name: </b></span>" + att.Well_Name + "<br/>";
        //     }
        //     if (att.OPERATOR != null) {
        //         content += "<span class='bold' title='Well&#39;s operator'><b>Operator: </b></span>" + att.OPERATOR + "<br/>";
        //     }
        //     if (att.County_Long != null) {
        //         content += "<span class='bold' title='Well&#39;s location'><b>County, State: </b></span>" + att.County_Long + ", " + att.State + "<br />";
        //     }
        //     if (att.PURPOSE != null) {
        //         content += "<span class='bold' title='Well&#39;s purpose'><b>Purpose: </b></span>" + wellPurposeFull + "<br />";
        //     }
        //     if (att.GL != null) {
        //         content += "<span class='bold' title='Well&#39;s ground level elevation'><b>Ground Level: </b></span>" + att.GL + " ft<br />";
        //     }
        //     if (att.FORM_TD != null) {
        //         content += "<span class='bold' title='Geologic formation at well&#39;s bottom'><b>Formation at TD: </b></span>" + att.FORM_TD + "<br />";
        //     }
        //     if (att.PROD_FORM != null) {
        //         content += "<span class='bold' title='Name of producing geologic formation'><b>Producing Formation: </b></span>" + att.PROD_FORM + "<br />";
        //     }
        //     if (att.Cored_Formation != null) {
        //         content += "<span class='bold' title='Name of cored geologic formation'><b>Cored Formation: </b></span>" + att.Cored_Formation + "<br />";
        //     }
        //     if (att.FIELD_NAME != null) {
        //         content += "<span class='bold' title='Name of producing geologic formation'><b>Oil-Gas Field: </b></span>" + att.FIELD_NAME + "<br />";
        //     }
        //     if (att.Notes != null && att.Notes != '') {
        //         content += "<span class='bold' title='Notes about well/sample'><b>Notes: </b></span>" + att.Notes + "<br />";
        //     }
        //     if (att.Latitude != null) {
        //         content += "<span class='bold' title='Well&#39;s latitude'><b>Latitude: </b></span>" + parseFloat(att.Latitude).toFixed(4) + "&deg;<br />";
        //     }
        //     if (att.Longitude != null) {
        //         content += "<span class='bold' title='Well&#39;s longitude'><b>Longitude: </b></span>" + parseFloat(att.Longitude).toFixed(4) + "&deg;<br />";
        //     }
        //     if (att.Easting != null) {
        //         content += "<span class='bold' title='Well&#39;s easting in NAD83'><b>Easting (NAD83): </b></span>" + parseFloat(att.Easting).toFixed(0) + " m <br />";
        //     }
        //     if (att.Northing != null) {
        //         content += "<span class='bold' title='Well&#39;s easting in NAD83'><b>Northing (NAD83): </b></span>" + parseFloat(att.Northing).toFixed(0) + " m <br />";
        //     }
        //     if (att.TWN != null) {
        //         content += "<span class='bold' title='Well&#39;s township'><b>Township: </b></span>" + att.TWN + "<br />";
        //     }
        //     if (att.RNG != null) {
        //         content += "<span class='bold' title='Well&#39;s range'><b>Range: </b></span>" + att.RNG + "<br />";
        //     }
        //     if (att.Section != null) {
        //         content += "<span class='bold' title='Well&#39;s section'><b>Section: </b></span>" + att.Section + "<br />";
        //     }

        //     return content; //This is required if passing information to another function
        // }



        var labelClass = new LabelClass({
            labelExpressionInfo: {
                expression: "$feature.LABEL"
            },
            symbol: {
                type: "label-3d", // autocasts as new LabelSymbol3D()
                symbolLayers: [{
                    type: "text", // autocasts as new TextSymbol3DLayer()
                    material: {
                        color: "red"
                    },
                    size: 12,
                    weight: "bold",
                }]
            }

        });

        app.view.on("click", function(event) {
            grid.clearSelection();
            app.view.graphics.removeAll();
            query("#panelDetails").removeClass("in");



        });



        watchUtils.when(app.view.popup, "selectedFeature", function photos(evt) {

            query("#panelInfo").removeClass("in");
            query("#panelDetails").removeClass("in");
            query("#panelInventory").removeClass("in");
            //console.log(app.view.popup.actions);
            app.view.popup.actions.splice(1, 2);
            app.view.popup.actions.push(wellInventory);

            objectID = app.view.popup.selectedFeature.attributes.OBJECTID;
            //query the well layer
            var queryTask = new QueryTask({
                url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/UCRC_Database_App_View/FeatureServer/0"
            });
            //query the well layers related table for photos
            relationQuery = new RelationshipQuery({
                objectIds: [objectID],
                outFields: ["Filename", "Path", "Type", "Top_Depth", "Bottom_Depth", "Fileurl"],
                returnGeometry: true,
                relationshipId: 1
            });
            //console.log(relationQuery);

            queryTask.executeRelationshipQuery(relationQuery).then(function(rslts) {
                console.log(rslts);

                document.getElementById("attDetails").innerHTML = "";
                var features = rslts[objectID].features;

                if (features) {
                    //console.log(features);
                    app.view.popup.actions.push(corePhotos);

                    //adds labels for popup action buttons. for some reason having more than two custom actions removes the labels from all of them
                    setTimeout(labelButtons, 100)

                    function labelButtons() {
                        var stringZoom = "Zoom To";
                        var spanZoom = document.createElement("SPAN");
                        spanZoom.className = "esri-popup__action-text";
                        spanZoom.innerHTML = stringZoom;
                        var actionButton = document.querySelectorAll('.esri-popup__feature-buttons .esri-popup__action');
                        var children = actionButton[0].childNodes.length;
                        if (children > 1) {} else {
                            actionButton[0].appendChild(spanZoom);
                        }

                        var stringInv = "Sample Types & Depths";
                        var spanInv = document.createElement("SPAN");
                        spanInv.className = "esri-popup__action-text";
                        spanInv.innerHTML = stringInv;
                        actionButton[1].appendChild(spanInv);

                        var stringPho = "Photos";
                        var spanPho = document.createElement("SPAN");
                        spanPho.className = "esri-popup__action-text";
                        spanPho.innerHTML = stringPho;
                        actionButton[2].appendChild(spanPho);

                    }



                } else {
                    query("#panelDetails").removeClass("in");
                    query("#collapseDetails").removeClass("in");
                }

                features.sort(function(a, b)
                {

                    var topDepthOne = a.attributes.Top_Depth;
                    var topDepthTwo = b.attributes.Top_Depth;
                    return topDepthOne - topDepthTwo;

                }
                );

                features.forEach(function(ftr) {
                    var t = ftr.attributes;
                    var fileURL = t.Fileurl;
                    var string = fileURL.substr(3);
                    var name = t.Filename;
                    var type = t.Type;
                    var display = t.Usage;
                    var tDepth = t.Top_Depth;
                    var bDepth = t.Bottom_Depth;
                    console.log(string);
                    //if (display == "PUBLIC" && name.match(/.jpg/) || name.match(/.JPG/)) {
                    if (name.match(/.jpg/) || name.match(/.JPG/)) {
                        document.getElementById("attDetails").innerHTML += "<li><img data-original='https://ugspub.nr.utah.gov/publications/core_photos/" + string + "' src='https://ugspub.nr.utah.gov/publications/core_photos/" + string + "'  alt='" + name + " '></li>";
                    }
                });
            });
        });


        // Defines an action to open photos from the selected feature
        var wellInventory = {
            title: "Sample Types & Depths",
            id: "well-inventory",
            className: "esri-icon-table"
        };

        // Defines an action to open photos from the selected feature
        var corePhotos = {
            title: "Photos",
            id: "photo-gallery",
            className: "esri-icon-media"
        };

        function photoGallery() {
            query("#panelInventory").removeClass("in");
            var viewer;
            app.view.on('click', function() {
                viewer.destroy();
                // -> true
            }, false);

            showHideCalcitePanels("#panelDetails", "#collapseDetails");
            viewer = new Viewer(gallery, {
                url: 'data-original',
            });
            console.log(viewer);

        }

        function coreInventory() {
            query("#panelDetails").removeClass("in");
            document.getElementById("attInventory").innerHTML = "";
            query("#panelInventory").collapse("show");
            query("#collapseInventory").collapse("show");


            //new query for selected wells
            var queryInventory = new QueryTask({
                url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/UCRC_Database_App_View/FeatureServer/0"
            });
            //query for related table of inventory
            relationQueryInventory = new RelationshipQuery({
                objectIds: [objectID],
                outFields: ["TYPE", "Top_Depth", "Bottom_Depth", ],
                relationshipId: 0
            });


            myArray = [];
            myArray1 = [];
            myArray2 = [];
            myArray3 = [];
            myArray4 = [];
            myArray5 = [];
            myArray6 = [];
            myArray7 = [];
            myArray8 = [];
            myArray9 = [];
            myArray10 = [];
            myArray11 = [];
            myArray12 = [];
            myArray13 = [];
            myArray14 = [];
            myArray15 = [];
            myArray16 = [];
            myArray17 = [];
            myArray18 = [];
            myArray19 = [];
            myArray20 = [];
            myArray21 = [];
            myArray22 = [];
            myArray23 = [];
            myArray24 = [];



            cuttingsArray = [];
            skeletonizedArray = [];
            slabArray = [];
            buttArray = [];
            chipsArray = [];
            corechipsArray = [];
            coreArray = [];
            outcropArray = [];
            sidewallArray = [];
            sampleArray = [];
            displayArray = [];
            oilArray = [];

            queryInventory.executeRelationshipQuery(relationQueryInventory).then(function(rslts) {

                var features = rslts[objectID].features;
                //console.log(features);


                //find all type values
                features.forEach(function(ftr) {
                    var t = ftr.attributes;
                    var type = t.TYPE;

                    if (type === "CUTTINGS") {
                        cuttingsArray.push(t)
                    } else if (type === "SKELETONIZED CORE") {
                        skeletonizedArray.push(t)
                    } else if (type === "SLABS") {
                        slabArray.push(t)
                    } else if (type === "BUTTS") {
                        buttArray.push(t)
                    } else if (type === "CHIPS") {
                        chipsArray.push(t)
                    } else if (type === "CORE CHIPS") {
                        corechipsArray.push(t)
                    } else if (type === "CORE") {
                        coreArray.push(t)
                    } else if (type === "OUTCROP SAMPLES") {
                        outcropArray.push(t)
                    } else if (type === "SIDEWALL") {
                        sidewallArray.push(t)
                    } else if (type === "SAMPLE") {
                        sampleArray.push(t)
                    } else if (type === "DISPLAY") {
                        displayArray.push(t)
                    } else if (type === "OIL SAMPLES") {
                        oilArray.push(t)
                    }

                });

                //check to see if cuttings exist for this well
                if (cuttingsArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Cuttings</b>";
                    //find min top depth
                    cuttingsArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray1.push(top);
                    });
                    finalArray1 = Math.min.apply(null, myArray1);
                    //get max bottom depth
                    cuttingsArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray2.push(bottom);
                    });
                    finalArray2 = Math.max.apply(null, myArray2);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray1 + " Feet" + "<br>Bottom Depth: " + finalArray2 + " Feet" + "<br>";
                }

                //check to see if skeletonized core exist for this well
                if (skeletonizedArray.length > 0) {
                    //find min top depth
                    skeletonizedArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray3.push(top);
                    });
                    finalArray3 = Math.min.apply(null, myArray3);

                    //get max bottom depth
                    skeletonizedArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray4.push(bottom);
                    });
                    finalArray4 = Math.max.apply(null, myArray4);
                    document.getElementById("attInventory").innerHTML += "<b>Skeletonized Core</b> <p> Top Depth: " + finalArray3 + " Feet" + "<br>Bottom Depth: " + finalArray4 + " Feet" + "<br>";
                }

                //check to see if slabs exist for this well
                if (slabArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Slabs</b>";
                    //find min top depth
                    slabArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray5.push(top);
                    });
                    finalArray5 = Math.min.apply(null, myArray5);
                    //get max bottom depth
                    slabArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray6.push(bottom);
                    });
                    finalArray6 = Math.max.apply(null, myArray6);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray5 + " Feet" + "<br>Bottom Depth: " + finalArray6 + " Feet" + "<br>";
                }

                //check to see if butts exist for this well
                if (buttArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Butts</b>";
                    //find min top depth
                    buttArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray7.push(top);
                    });
                    finalArray7 = Math.min.apply(null, myArray7);
                    //get max bottom depth
                    buttArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray8.push(bottom);
                    });
                    finalArray8 = Math.max.apply(null, myArray8);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray7 + " Feet" + "<br>Bottom Depth: " + finalArray8 + " Feet" + "<br>";
                }

                //check to see if chips exist for this well
                if (chipsArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Chips</b>";
                    //find min top depth
                    chipsArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray9.push(top);
                    });
                    finalArray9 = Math.min.apply(null, myArray9);
                    //get max bottom depth
                    chipsArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray10.push(bottom);
                    });
                    finalArray10 = Math.max.apply(null, myArray10);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray9 + " Feet" + "<br>Bottom Depth: " + finalArray10 + " Feet" + "<br>";
                }

                //check to see if core chips exist for this well
                if (corechipsArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Core Chips</b>";
                    //find min top depth
                    corechipsArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray11.push(top);
                    });
                    finalArray11 = Math.min.apply(null, myArray11);
                    //get max bottom depth
                    corechipsArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray12.push(bottom);
                    });
                    finalArray12 = Math.max.apply(null, myArray12);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray11 + " Feet" + "<br>Bottom Depth: " + finalArray12 + " Feet" + "<br>";
                }

                //check to see if core exist for this well
                if (coreArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Core</b>";
                    //find min top depth
                    coreArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray13.push(top);
                    });
                    finalArray13 = Math.min.apply(null, myArray13);
                    //get max bottom depth
                    coreArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray14.push(bottom);
                    });
                    finalArray14 = Math.max.apply(null, myArray14);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray13 + " Feet" + "<br>Bottom Depth: " + finalArray14 + " Feet" + "<br>";
                }

                //check to see if outcrop exist for this well
                if (outcropArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Outcrop Sample</b>";
                    //find min top depth
                    outcropArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray15.push(top);
                    });
                    finalArray15 = Math.min.apply(null, myArray15);
                    //get max bottom depth
                    outcropArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray16.push(bottom);
                    });
                    finalArray16 = Math.max.apply(null, myArray16);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray15 + " Feet" + "<br>Bottom Depth: " + finalArray16 + " Feet" + "<br>";
                }

                //check to see if sidewall exist for this well
                if (sidewallArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Sidewall</b>";
                    //find min top depth
                    sidewallArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray17.push(top);
                    });
                    finalArray17 = Math.min.apply(null, myArray17);
                    //get max bottom depth
                    sidewallArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray18.push(bottom);
                    });
                    finalArray18 = Math.max.apply(null, myArray18);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray17 + " Feet" + "<br>Bottom Depth: " + finalArray18 + " Feet" + "<br>";
                }

                //check to see if sidewall exist for this well
                if (sampleArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Sample</b>";
                    //find min top depth
                    sampleArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray19.push(top);
                    });
                    finalArray19 = Math.min.apply(null, myArray19);
                    //get max bottom depth
                    sampleArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray20.push(bottom);
                    });
                    finalArray20 = Math.max.apply(null, myArray20);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray19 + " Feet" + "<br>Bottom Depth: " + finalArray20 + " Feet" + "<br>";
                }

                //check to see if sidewall exist for this well
                if (displayArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Display Sample</b>";
                    //find min top depth
                    displayArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray21.push(top);
                    });
                    finalArray21 = Math.min.apply(null, myArray21);
                    //get max bottom depth
                    displayArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray22.push(bottom);
                    });
                    finalArray22 = Math.max.apply(null, myArray22);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray21 + " Feet" + "<br>Bottom Depth: " + finalArray22 + " Feet" + "<br>";
                }

                //check to see if sidewall exist for this well
                if (oilArray.length > 0) {
                    document.getElementById("attInventory").innerHTML += "<b>Oil Sample</b>";
                    //find min top depth
                    oilArray.forEach(function(ftr) {
                        var top = ftr.Top_Depth;
                        myArray23.push(top);
                    });
                    finalArray23 = Math.min.apply(null, myArray23);
                    //get max bottom depth
                    oilArray.forEach(function(ftr) {
                        var bottom = ftr.Bottom_Depth;
                        myArray24.push(bottom);
                    });
                    finalArray24 = Math.max.apply(null, myArray24);
                    document.getElementById("attInventory").innerHTML += "<p> Top Depth: " + finalArray23 + " Feet" + "<br>Bottom Depth: " + finalArray24 + " Feet" + "<br>";
                }

            });



        }

        app.view.popup.on("trigger-action", function(event) {
            // Execute the photoGallery() function if the photo action is clicked
            if (event.action.id === "photo-gallery") {
                photoGallery();
            }
            if (event.action.id === "well-inventory") {
                coreInventory();
            }
        });


        var counties = new FeatureLayer({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Core_Locations_Supporting_Data/FeatureServer/1",
            title: "Counties",
            visible: true,
            labelsVisible: true,
            legendEnabled: false
        });


        var basins = new FeatureLayer({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Core_Locations_Supporting_Data/FeatureServer/0",
            title: "Basins",
            visible: true,
            labelsVisible: true,
            legendEnabled: true
        });


        var fields = new FeatureLayer({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Core_Locations_Supporting_Data/FeatureServer/2",
            title: "Oil and Gas Fields",
            visible: true,
            legendEnabled: true
        });

        var townrange = new FeatureLayer({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Core_Locations_Supporting_Data/FeatureServer/3",
            title: "Township and Range",
            visible: true,
            outfields: ["*"],
            legendEnabled: false,
            minScale: 500000,
            labelsVisible: true,
            labelingInfo: [labelClass]
        });

        app.view.map.add(rockcore);
        app.view.map.add(fields);
        app.view.map.add(townrange);
        app.view.map.add(counties);
        app.view.map.add(basins);

        var lgdiv = query("#collapseLegend > .panel-body"); //returns an array with 1 item.
        app.legend = new Legend({
            view: app.view,
        }, lgdiv[0]);




        var lyrdiv = query("#collapseLayers > .panel-body"); //returns an array with 1 item.
        app.layerList = new LayerList({
            view: app.view,
        }, lyrdiv[0]);



        var grid = new(declare([OnDemandGrid, Selection]))({
            class: "grid",
            selectionMode: 'single',
            autoHeight: true,
            autoWidth: true,
            initialWidth: "100%",

            columns: [{
                    label: "API",
                    field: "UWI"
                },
                {
                    label: "Well Name",
                    field: "Well_Name"
                },
                {
                    label: "Operator",
                    field: "OPERATOR"
                },
            ]
        }, "grid");
        grid.startup();


        function resizeGrid() {
            grid.resize();
            grid.update();
        }


        app.searchWidgetNav.allPlaceholder = "Search Wells";
        app.searchWidgetNav.activeSourceIndex = "1";

        app.searchWidgetNav.on("search-complete", function(e) {
            app.view.popup.clear(); // close popup if its open from last search
            var results = null; // clear old searches
            query("#panelDetails").removeClass("in");
            //console.log(e);
            //console.log(e["results"]);


            if (e["results"]) {

                // first we need to map the source layer to the graphics
                resultsArray = [];

                e["results"].forEach(function(rslt) { // loop through the three possible source layers

                    //console.log(rslt);

                    // now loop through each graphic and assign the layer field
                    rslt.results.forEach(function(rslt2) {

                        resultsArray.push(rslt2.feature);
                    });
                    //resultsArray.push(graphics);
                });

                //console.log(resultsArray);

                // put our attributes in an object the datagrid can ingest.
                var srch = {
                    "items": []
                };
                //console.log(srch);
                resultsArray.forEach(function(ftrs) {

                    var att = ftrs.attributes;

                    srch.items.push(att);
                });
                console.log(srch);

                var test_store = new Memory({
                    data: srch,
                    idProperty: "OBJECTID"
                });
                //console.log(test_store);
                grid.set('collection', test_store);

                grid.on('.dgrid-row:click', function(event) {
                    //console.log(event);

                    query("#panelDetails").removeClass("in"); //close any open panels
                    query("#collapseDetails").removeClass("in");
                    app.view.graphics.removeAll();
                    var idx = "";
                    var idx = grid.row(event).id;
                    console.log(idx);
                    var item;
                    resultsArray.forEach(function(ftr) {
                        if (ftr.attributes.OBJECTID === idx) {
                            item = ftr;
                        }
                    });
                    //console.log(item);

                    var cntr = [];
                    cntr.push(item.geometry.longitude);
                    cntr.push(item.geometry.latitude);

                    //console.log(cntr);
                    app.view.goTo({
                        center: cntr, // position:
                        zoom: 13
                    });

                    app.view.graphics.removeAll();
                    var graphic = new Graphic({

                        geometry: item.geometry,
                        symbol: new SimpleMarkerSymbol({
                            //color: [0,255,255],
                            style: "circle",
                            //size: "8px",
                            outline: {
                                color: [255, 255, 0],
                                width: 3
                            }
                        })
                    });
                    //console.log("poop");

                    app.view.graphics.add(graphic);

                    


                    // open the popup, assign its attributes and location
                    app.view.popup.open({
                        features: [item],
                        location: item.geometry
                    });

                    //console.log(item);




                }, );

            } // end if

        });

        grid.on('dgrid-deselect', function(event) {
            //console.log('Row de-selected: ', event.rows[0].data);
            app.view.graphics.removeAll();
            app.view.popup.clear();

        });

        app.searchWidgetNav.on("search-start", function(e) {
            app.view.popup.close(); //close previous popup when starting new search
            //query(".panel.in").removeClass("in");   //close any open panels
            //query(".panel-collapse").removeClass("in");
            query("#panelInfo").removeClass("in"); //close any open panels
            query("#collapseInfo").removeClass("in");
            //query("#panelGrid").addClass("in");   // open the search result grid panel
            query("#panelGrid").collapse("show");
            //query("#collapseGrid").addClass("in");
            query("#collapseGrid").collapse("show");

        });

        app.searchWidgetNav.on("search-clear", function(e) {
            app.view.graphics.removeAll();
            resultsArray = null;
            app.view.popup.close();
            query("#panelDetails").removeClass("in"); //close any open panels
            query("#collapseDetails").removeClass("in");
            query("#panelGrid").collapse("hide");
            query("#collapseGrid").collapse("hide");
        });


        var sources = [{
            featureLayer: rockcore,
            // new FeatureLayer({
            //     url: wellsUrl,
            //     outFields: ["*"],
            //     popupTemplate: {
            //         title: "Well Locations",
            //         content: createClickContentWells
            //     }
            // }),
            popupEnabled: true,
            displayField: "Well_Name", // see FeatureLayerSource API Reference
            searchFields: ["UWI", "Well_Name", "OPERATOR", "PROD_FORM", "TWN", "RNG", "FORM_TD", "Notes"], // see FeatureLayerSource API Reference
            exactMatch: false,
            outFields: ["*"],
            name: "Well Search",
            allPlaceholder: "Well Search",
            maxResults: 100, //can we increase this number???
            maxSuggestions: 0,
            minSuggestCharacters: 2,
            resultGraphic: {
                color: [255, 241, 58],
                fillOpacity: 0.4
            }
        }, ];

        app.searchWidgetNav.sources = sources;


    });

} // end viewloaded wrapper function