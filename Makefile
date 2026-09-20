# make check  檢查格式、HTML 規範、JS 語法（任何一項失敗就回傳錯誤）
# make fmt    自動修正格式
# 第一次使用或換環境時，先執行 npm ci 安裝工具

SRC      := $(wildcard *.html *.css *.js *.md .github/workflows/*.yml)
PRETTIER := npx prettier --end-of-line auto

.PHONY: check fmt

check:
	$(PRETTIER) --check $(SRC)
	npx html-validate $(wildcard *.html)
	node --check main.js
	@echo All checks passed.

fmt:
	$(PRETTIER) --write $(SRC)
