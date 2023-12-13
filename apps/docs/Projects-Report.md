# Projects Report

To make the report we need to map each header to its corresponding data source
from http request from Sonar Qube REST API.

## Headers relation

1. [Project Name](#project-name)
2. [Project Key](#project-key)
3. [Lines of Code](#lines-of-code)
4. [Quality Gate](#quality-gate)
5. [Language n](#language-n)
6. [Quality Profile per Language](#quality-profile-language-n)
7. [Lines of Code per Language](#lines-of-code-per-language)
8. [Lines](#for-the-following-header-fields-the-same-request-will-be-used)
9. [Statements](#for-the-following-header-fields-the-same-request-will-be-used)
10. [Functions](#for-the-following-header-fields-the-same-request-will-be-used)
11. [Classes](#for-the-following-header-fields-the-same-request-will-be-used)
12. [Files](#for-the-following-header-fields-the-same-request-will-be-used)
13. [Comment Lines](#for-the-following-header-fields-the-same-request-will-be-used)
14. [Comments %](#for-the-following-header-fields-the-same-request-will-be-used)

## Headers

### Project Name
#### Bulk Request

[Basic data](./Important-Request#get-basic-data)

#### Notes
One could get 500 max projects per request

### Project Key
#### Bulk Request

[Basic data](./Important-Request#get-basic-data)

#### Notes
One could get 500 max projects per request

***
**Disclaimer**
***

Starting from this moment, the data retrieval process requires individual requests one at a time. It doesn't allow passing a list of projects; instead, it supports only one project per query parameter.

### Lines of Code
#### Single Request

[left data of table project](./Important-Request#get-data-of-table-project)

### Quality Gate
#### Single Request

[Single Request](./Important-Request#get-data-of-table-about-languages-of-project)

### Language-n
#### Single Request

[Single Request](./Important-Request#get-data-of-table-about-languages-of-project)

#### Notes
The field name language is an array 
of programing languages .

### Quality profile language-n
#### Single Request

[Single Request](./Important-Request#get-data-of-table-about-languages-of-project)

#### Notes
The field QualityProfiles is an array 
of programing languages .

### Lines of code per language
#### Single Request

[Single Request](./Important-Request#get-data-of-table-project)

#### Notes
Number of ```lines of code``` for each language is not separated in different attributes but is   
a string that need parsing

The following structure could be nested but the format of ```value``` is accurate

```json
{
  "metric": "ncloc_language_distribution",
  "value": "css=183;java=909;jsp=720"
}
```

For instance
```ts
const parsedDataLanguages = (dataString)=>{
  const languagePairs = dataString.split(';');
  const languageMap = {};

  languagePairs.forEach((pair) => {
    const [language,value] = pair.split("=");
    languageMap[language] = value;
  })

  return languageMap
  //{css: '183', java: '909', jsp: '720'}
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

#### Single Request

[Single Request](./Important-Request#get-data-of-table-project)







