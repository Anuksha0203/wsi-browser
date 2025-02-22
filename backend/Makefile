PROJECT_NAME = wsi_server
DOCKER_IMAGE_NAME = wsi_server

CURRENT_DIR := $(shell pwd)

#################################################################################
# SETUP COMMANDS          	                                                    #
#################################################################################
install_isyntax_sdk:
	sudo apt -y update
	sudo apt -y upgrade
	wget http://archive.ubuntu.com/ubuntu/pool/universe/m/mesa/libgles2-mesa_23.0.4-0ubuntu1~22.04.1_amd64.deb
	sudo apt -y install ./libgles2-mesa_23.0.4-0ubuntu1~22.04.1_amd64.deb
	wget http://archive.ubuntu.com/ubuntu/pool/universe/m/mesa/libegl1-mesa_22.0.1-1ubuntu2_amd64.deb
	sudo apt -y install ./libegl1-mesa_22.0.1-1ubuntu2_amd64.deb
	wget http://archive.ubuntu.com/ubuntu/pool/universe/t/tinyxml/libtinyxml2.6.2v5_2.6.2-4_amd64.deb
	sudo apt install ./libtinyxml2.6.2v5_2.6.2-4_amd64.deb
	rm ./*.deb
	sudo gdebi -n ./libraries/philips-pathology-sdk/*pixelengine*.deb
	sudo gdebi -n ./libraries/philips-pathology-sdk/*eglrendercontext*.deb
	sudo gdebi -n ./libraries/philips-pathology-sdk/*gles2renderbackend*.deb
	sudo gdebi -n ./libraries/philips-pathology-sdk/*gles3renderbackend*.deb
	sudo gdebi -n ./libraries/philips-pathology-sdk/*softwarerenderer*.deb

#################################################################################
# CONTAINER COMMANDS                                                            #
#################################################################################
image:
	docker build -t $(DOCKER_IMAGE_NAME) .

run:
	docker run --shm-size=64G \
				--rm \
				--name $(USER)-$(PROJECT_NAME) \
				--ipc=host \
				--network=host \
				-v $(CURRENT_DIR):/workspace \
				-v $(CURRENT_DIR)/../public:/workspace/public \
				-it $(DOCKER_IMAGE_NAME)

