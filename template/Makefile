R:

	Rscript -e "rmarkdown::render('data/2015-09-12_slushgraphic-template.Rmd')"
	open data/2015-09-12_slushgraphic-template.html

R_deploy:

	cp data/2015-09-12_slushgraphic-template.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/2015-09-12_slushgraphic-template_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/2015-09-12_slushgraphic-template.html