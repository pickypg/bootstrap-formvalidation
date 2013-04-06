DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔\033[39m
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#


#
# BUILD DOCS
#

build:
  @echo "\n${HR}"
	@echo "Building Bootstrap-FormValidation..."
	@echo "${HR}\n"
	@./node_modules/.bin/jshint js/*.js --config js/.jshintrc
	@./node_modules/.bin/jshint js/tests/unit/*.js --config js/.jshintrc
	@echo "Running JSHint on javascript...             ${CHECK} Done"
	@node docs/build
	@cp js/tests/vendor/jquery.js docs/assets/js/
	@echo "Compiling documentation...                  ${CHECK} Done"
	@cat js/bootstrap-formvalidation.js js/bootstrap-formcontrol.js > docs/assets/js/bootstrap-formvalidation.js
	@./node_modules/.bin/uglifyjs -nc docs/assets/js/bootstrap-formvalidation.js > docs/assets/js/bootstrap-formvalidation.min.tmp.js
	@echo "/**\n* Bootstrap-FormValidation.js v0.1 by Chris Earle\n* Copyright 2013 Chris Earle\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > docs/assets/js/copyright.js
	@cat docs/assets/js/copyright.js docs/assets/js/bootstrap-formvalidation.min.tmp.js > docs/assets/js/bootstrap-formvalidation.min.js
	@rm docs/assets/js/copyright.js docs/assets/js/bootstrap-formvalidation.min.tmp.js
	@echo "Compiling and minifying javascript...       ${CHECK} Done"
	@echo "\n${HR}"
	@echo "Bootstrap-FormValidation successfully built at ${DATE}."
	@echo "${HR}\n"
	@echo "Thanks for using Bootstrap-FormValidation\n"

#
# RUN JSHINT & QUNIT TESTS IN PHANTOMJS
#

test:
	./node_modules/.bin/jshint js/*.js --config js/.jshintrc
	./node_modules/.bin/jshint js/tests/unit/*.js --config js/.jshintrc
	node js/tests/server.js &
	phantomjs js/tests/phantom.js "http://localhost:3000/js/tests"
	kill -9 `cat js/tests/pid.txt`
	rm js/tests/pid.txt

#
# CLEANS THE ROOT DIRECTORY OF PRIOR BUILDS
#

clean:
	rm -r bootstrap-formvalidation

#
# BUILD SIMPLE BOOTSTRAP-FORMVALIDATION DIRECTORY
# recess & uglifyjs are required
#

bootstrap-formvalidation: bootstrap-js

#
# JS COMPILE
#
bootstrap-formvalidation-js: bootstrap-formvalidation/js/*.js

bootstrap-formvalidation/js/*.js: js/*.js
	mkdir -p bootstrap-formvalidation/js
	cat js/bootstrap-formvalidation.js js/bootstrap-formcontrol.js
	./node_modules/.bin/uglifyjs -nc bootstrap-formvalidation/js/bootstrap-formvalidation.js > bootstrap-formvalidation/js/bootstrap-formvalidation.min.tmp.js
	echo "/*!\n* Bootstrap-FormValidation.js by Chris Earle\n* Copyright 2013 Chris Earle\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > bootstrap-formvalidation/js/copyright.js
	cat bootstrap-formvalidation/js/copyright.js bootstrap-formvalidation/js/bootstrap-formvalidation.min.tmp.js > bootstrap-formvalidation/js/bootstrap-formvalidation.min.js
	rm bootstrap-formvalidation/js/copyright.js bootstrap-formvalidation/js/bootstrap-formvalidation.min.tmp.js

.PHONY: docs bootstrap-formvalidation-js
