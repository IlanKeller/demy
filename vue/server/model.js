exports.modelRefresh = function(ws){
  return new Promise(function(resolved1,reject1){
    const req = require('request')
    ,parser = require('xml2json')
    ,fs = require('fs')
    console.log('Refreshing the model')
    let datasourcesJson = 0
    const test = new Promise((resolve,reject)=>{
      fs.readFile('../data/fod/workspaces/'+ ws +'/datasources.json', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        datasourcesJson = data
        resolve(datasourcesJson)
      });
    })
    test.then((datasourceJson)=>{

      const datasources = JSON.parse(datasourcesJson)
      const  login = datasources.data[0].login
      , psw = datasources.data[0].psw
      , url = 'https://' + login + ':' + psw + '@respe-decl.preprod.voozanoo.net/decl/ws/dataset'
      , model = {
        "sources":
        [
          {"name":"voozanoo"}
        ]
        ,"groups":[
          "Varsets", "Data Queries"
        ]
        ,"reports":
          [
           {"name":"Malaria evolution by Region", "order":1, "visible":true, "Source":"myDb", "group":"Reports", "collapsed":"true"}
           ,{"name":"Vaccination coverage analysis", "order":1, "visible":true, "Source":"myDb", "group":"Reports", "collapsed":"true"}
           ,{"name":"Poverty & weather correlation", "order":1, "visible":true, "Source":"myDb", "group":"Reports", "collapsed":"true"}
           ,{"name":"Infectious diseases evolution ", "order":1, "visible":true, "Source":"myDb", "group":"Reports", "collapsed":"true"}
        ]
        ,"tables":[
            {"name":"Patient", "order":1, "visible":true, "Source":"myDb", "group":"Varsets", "collapsed":"true"
            ,"fields": [
               {"name":"IdPatient","type":"column", "dataType":"string", "formule":"IdPatient","format":null, "visible":false, "order":0, "level":1, "table":"Patient"}
              ,{"name":"Nom","type":"column", "dataType":"string", "formule":"Nom","format":null, "visible":true, "order":1, "level":1, "table":"Patient"}
              ,{"name":"Prenom","type":"column", "dataType":"string", "formule":"Prenom","format":null, "visible":true, "order":2, "level":1, "table":"Patient"}
              ,{"name":"Convocation","type":"column", "dataType":"string", "formule":"Convocation","format":null, "visible":true, "order":3, "level":1, "table":"Patient"}
              ,{"name":"Convocation-code","type":"column", "dataType":"string", "formule":"Convocation-code","format":null, "visible":true, "order":4, "level":2, "table":"Patient"}
              ,{"name":"Convocation-libellé","type":"column", "dataType":"string", "formule":"Convocation-libellé","format":null, "visible":true, "order":5, "level":2, "table":"Patient"}
              ,{"name":"Date Naissance","type":"column", "dataType":"date", "formule":"BirthDate","format":null,"visible":true, "order":6, "level":1, "table":"Patient"}
              ,{"name":"Date Naissance.Année","type":"column", "dataType":"int", "formule":"GetYear(BirthDate)","format":null,"visible":true, "order":7, "level":2, "table":"Patient"}
              ,{"name":"Date Naissance.Mois","type":"column","dataType":"string","formule":"Format(BirthDate, 'yyyyMMM')","format":null,"visible":true,"order":8,"level":2,"orderby":"Format(Date, 'yyyyMM')","table":"Patient"}
              ,{"name":"Date Naissance.Jour","type":"column", "dataType":"int", "formule":"GetDay(BirthDate)","format":null,"visible":true, "order":9, "level":2,"table":"Patient"}
              ]
           }
          ,{"name":"Pays", "order":2, "visible":true, "Source":"myDb", "group":"Varsets", "collapsed":"true"
            ,"fields": [
               {"name":"Code Pays","type":"column", "dataType":"string", "formule":"Code Pays","format":null, "visible":true, "order":1, "level":1, "table":"Pays"}
              ,{"name":"Pays","type":"column", "dataType":"string", "formule":"Pays","format":null, "visible":true, "order":2, "level":1, "table":"Pays"}
              ,{"name":"Region","type":"column", "dataType":"string", "formule":"Region","format":null, "visible":true, "order":3, "level":1, "table":"Pays"}
              ]
           }
          ,{"name":"Visite", "order":3, "visible":true, "Source":"myDb", "group":"Varsets", "collapsed":"true"
            ,"fields": [
               {"name":"IdPatient","type":"column", "dataType":"string", "formule":"IdPatient","format":null, "visible":false, "order":0, "level":1, "table":"Visite"}
              ,{"name":"Age Patient","type":"column", "dataType":"int","formule":"DateDiff(Date, Now(), 'yyyy')","format":null,"visible":true, "order":1, "level":1, "table":"Visite"}
              ,{"name":"Date","type":"column", "dataType":"date", "formule":"Date","format":null,"visible":true, "order":2, "level":1, "table":"Visite"}
              ,{"name":"Date.Année","type":"column", "dataType":"int", "formule":"GetYear(Date)","format":null,"visible":true, "order":3, "level":2, "table":"Visite"}
              ,{"name":"Date.Mois","type":"column","dataType":"string","formule":"Format(Date, 'yyyyMMM')","format":null,"visible":true,"order":4,"level":2,"orderby":"Format(Date, 'yyyyMM')", "table":"Visite"}
              ,{"name":"Date.Jour","type":"column", "dataType":"int", "formule":"GetDay(Date)","format":null,"visible":true, "order":4, "level":2, "table":"Visite"}
              ,{"name":"Code Pays","type":"column", "dataType":"string", "formule":"Code Pays","format":null, "visible":false, "order":5, "level":1, "table":"Visite"}
              ,{"name":"Code Postale","type":"column", "dataType":"string", "formule":"Code Postale","format":null, "visible":true, "order":6, "level":1, "table":"Visite"}
              ]
          }]
      }

      req.get(url, (error, res, body) => {
        datasetXml = body
        const datasetJson = JSON.parse(parser.toJson(datasetXml))
        const dataset = datasetJson.root.response.dataset
    Promise.all(
        dataset.map((oItem, iIndex) => new Promise(function(resolve, reject) {
          const url = 'https://' + login + ':' + psw + '@respe-decl.preprod.voozanoo.net/decl/ws/dataset/id/'+ oItem.id +'/format/json/'
          req.get(url, (error, res, body) => {
            const dataQuerie = JSON.parse(body)
          if(Object.keys(dataQuerie).indexOf('metadata') != -1){
            const fields = dataQuerie.metadata.fields
            const table = {"name":oItem.name, "order":iIndex, "visible":true, "Source":"varset", "group":"Data Queries", "collapsed":"true"
              ,"fields":[]}
            let index = 0
            for (var d in fields) {
              const field = {"name":fields[d].default_label,"type":"column", "dataType":fields[d].type, "formule":"","format":null, "visible":true, "order":index, "level":1, "table":dataQuerie.name}
              table.fields.push(field)
              index++
            }
            model.tables.push(table)
          }

      if (error) {
        return resolve({error});
      }

            resolve({body});
          })
        }))
      )
      .then(aResult => {
        aResult.forEach(oItem => {
          if (oItem.error) {
            console.error(oItem.error)
            return;
          }
        oItem.body;
        })
        modelJSON = JSON.stringify(model)

        fs.appendFile('../data/fod/workspaces/'+ ws + '/model.json', modelJSON, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
            resolved1()
        });
      })
      .catch(console.error);
      })
    })
    .catch(console.error)
  })
}
