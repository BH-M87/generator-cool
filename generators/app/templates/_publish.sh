js_home=`pwd`

## param start
relative_location="../"
java_git_repository="git@github.com"
java_group_name=""
java_name=""
java_resources_location="src/main/resources/META-INF/resources"
java_branch_names=""
## param end

java_git_location="${java_git_repository}:${java_group_name}/${java_name}.git"
java_project_location="${js_home}/${relative_location}${java_name}"
java_resources_location="${java_project_location}/${java_resources_location}"
date=`date`

echo $java_resources_location

if [ ! -d ${java_project_location} ]; \
then
echo "JAVA project not exists, git clone it first!!!" \
echo ${java_git_location} \
&& cd ${relative_location} \
&& git clone ${java_git_location}
fi 

# if use onebox-localify, add following script after npm run build
# && echo 'Run build finished!!! Start onebox-localify!!!' \
# && onebox-localify --scan-path ./build --backend-path ./ \
# && onebox-localify --scan-path ./build/externals --backend-path ./ \
# && echo 'Finish onebox-localify!!!' \
cd ${js_home} \
&& git pull \
&& npm run build \
&& cd ${java_project_location} \
&& for java_branch_name in ${java_branch_names};
do 
echo "Starting publish branch ${java_branch_name}:" \
&& git checkout ${java_branch_name} \
&& git pull \
&& rm -rf ${java_resources_location}/* \
&& cp -r ${js_home}/build/* ${java_resources_location} \
&& git status \
&& git add . \
&& git commit -m "Update fe build version automatically!! Date: ${date}" \
&& git push \
&& echo "Publish branch ${java_branch_name} success!!!";
done
