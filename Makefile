default: help

help:
	@echo "   \033[35mmake\033[0m \033[1m命令使用说明\033[0m"
	@echo "   \033[35mmake install\033[0m\t---  安装依赖"
	@echo "   \033[35mmake clean\033[0m\t---  清除已经安装的依赖及缓存"
	@echo "   \033[35mmake dev\033[0m\t---  开发模式（在 build 的基础上 watch 文件变化并自动 build）"

install:
	@hash="cache-restfulapisdk-$$(cat Makefile package.json | openssl sha1 | tail -c33)"; \
	path="/tmp/$$hash"; \
	src="$$(pwd)"; \
	if [ -d $$path ] && [ -d $$path/node_modules ]; then \
	  if [ ! -d node_modules ]; then \
	    echo "\033[1mLoad\033[0m \033[35mnode_modules\033[0m from \033[32m$$hash\033[0m."; \
	    cp -R $$path/* $$src; \
	  fi; \
	else \
	  if which cnpm > /dev/null; then \
	    cnpm install; \
	  else \
	    npm install; \
	  fi; \
	  mkdir -p $$path; \
	  cp -R $$src/node_modules $$path; \
	fi

test: install
	@npm run build

dev: install
	@npm run watch


clean:
	@echo "正在清除 ... \c"
	@rm -rf {*/**/node_modules,*/**/tmp/cache-undefined-*}
	@echo "\033[32m完成\033[0m"
