R:

	Rscript -e "rmarkdown::render('data/GRRRAPHIC.Rmd')"
	open data/GRRRAPHIC.html

R_deploy:

	cp data/GRRRAPHIC.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/GRRRAPHIC_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/GRRRAPHIC.html