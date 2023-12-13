# Projects Report

To make the report we need to map each header to its corresponding data source
from http request from Sonar Qube REST API.

## Headers relation

- [Project Name](#project-name)
- [Project Key](#project-key)
- [Lines of Code](#lines-of-code)
- [Quality Gate](#quality-gate)
- [Language n](#language-n)
- [Quality Profile per Language](#quality-profile-language-n)
- [Lines of Code per Language](#lines-of-code-per-language)
- [Lines](#for-the-following-header-fields-the-same-request-will-be-used)
- [Statements](#for-the-following-header-fields-the-same-request-will-be-used)
- [Functions](#for-the-following-header-fields-the-same-request-will-be-used)
- [Classes](#for-the-following-header-fields-the-same-request-will-be-used)
- [Files](#for-the-following-header-fields-the-same-request-will-be-used)
- [Comment Lines](#for-the-following-header-fields-the-same-request-will-be-used)
- [Comments %](#for-the-following-header-fields-the-same-request-will-be-used)

## Headers

### Project Name
#### Request

[Basic data](./Important-Request#get-basic-data)

#### Notes
One could get 500 max projects per request

### Project Key
#### Request

[Basic data](./Important-Request#get-basic-data)

#### Notes
One could get 500 max projects per request

***
**Disclaimer**
***

Starting from this moment, the data retrieval process requires individual requests one at a time. It doesn't allow passing a list of projects; instead, it supports only one project per query parameter.

### Lines of Code
#### Request

[left data of table project](./Important-Request#get-data-of-table-project)

### Quality Gate
#### Request

[data about of languages](./Important-Request#get-data-of-table-about-languages-of-project)

### Language-n
#### Request

[data about of languages](./Important-Request#get-data-of-table-about-languages-of-project)

#### Notes
The field name language is an array 
of programing languages .

### Quality profile language-n
#### Request

[data about of languages](./Important-Request#get-data-of-table-about-languages-of-project)

#### Notes
The field QualityProfiles is an array 
of programing languages .

### Lines of code per language
#### Request

[Get data of table Project](./Important-Request#get-data-of-table-project)

#### Notes
the information of the lines of code comes in 1 single line for all languages
ejm:

```json
{
  "metric": "ncloc_language_distribution",
  "value": "css=183;java=909;jsp=720"
}
```

***
### For the following header fields, the same request will be used
* lines
* statements
* functions
* classes
* files
* comment_lines
* comment_lines_density

#### Request

[Get data of table Project](./Important-Request#get-data-of-table-project)







