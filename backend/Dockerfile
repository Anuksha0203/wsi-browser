FROM ubuntu:24.04

# Install base utilities
RUN apt-get update \
    && apt-get install -y build-essential wget sudo gdebi-core curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install miniconda
ENV CONDA_DIR=/opt/conda
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda

# Put conda in path so we can use conda activate
ENV PATH=$CONDA_DIR/bin:$PATH
RUN conda init bash

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

# Create the environment
WORKDIR /workspace/wsi_server
ADD wsi_server ./wsi_server
COPY environment.yml setup.py Makefile ./
RUN conda env create -f environment.yml
ENV CONDA_DEFAULT_ENV=wsi_serverenv
RUN echo "conda activate $CONDA_DEFAULT_ENV" >> ~/.bashrc

# Install the isyntax sdk
ADD libraries ./libraries
RUN make install_isyntax_sdk
