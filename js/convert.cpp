#include<bits/stdc++.h>
using namespace std;
int main(){
    freopen("excel.txt","r",stdin);
    freopen("data_raw.js","w",stdout);
    //将所有换行转化为“#”
    char ch;
    printf("var rawData = \'");
    while(scanf("%c",&ch)!=EOF){
        if(ch=='\n') ch='#';
        if(ch=='\t') ch='@';
        printf("%c",ch);
    }
    printf("\';\n");
    return 0;
}