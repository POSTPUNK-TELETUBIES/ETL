# Important Requests

## Projects

### Get basic data 

One could get max 500 projects per request

```http                                                                          
GET /api/components/search_projects?ps=500 HTTP/2
Host: askToChpaterLeadForTheLinkOfSonarQube
authorization: consultSonarQubeApiDocumentation
accept: aplication/json

```

For example if one wants to migrate the basic data of projects
in one request there should be 500 at max projects to bulk
create/migrate.

### Get data of table Project
The request provides us with the following information if we pass it to you through metricKeys 

* lines
* statements
* functions
* classes
* files
* comment_lines
* comment_lines_density
* ncloc (lines of code)
* ncloc_language_distribution
* lines of code language-n

```http  
GET /api/measures/component?component=nameKeyProject&metricKeys=listOfMetricNames HTTP/2
Host: askToChpaterLeadForTheLinkOfSonarQube
authorization: consultSonarQubeApiDocumentation
accept: aplication/json
```

To obtain these fields, you must make a request per project since it does not allow you to pass 
a list of projects.


### Get data of table about languages of Project
The request provides us with information about the languages ​​and the quality gate.

* quality gate
* language-n
* quality profile language-n

```http  
GET /api/navigation/component?component=nameKeyProject HTTP/2
Host: askToChpaterLeadForTheLinkOfSonarQube
authorization: consultSonarQubeApiDocumentation
accept: aplication/json
```

To obtain these fields, you must make a request per project since it does not allow you to pass 
a list of projects.

