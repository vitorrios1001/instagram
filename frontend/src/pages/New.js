import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './New.css'

import api from '../services/api'
import { Spin, message } from 'antd';

class New extends Component {

    state = {
        image: null,
        author: '',
        place: '',
        description: '',
        hashtags: '',
        loading: false
    }

    handleSubmit = async  e => {
        e.preventDefault();

        const { image, author, place, description, hashtags } = this.state

        if (!image || !author || !place || !description || !hashtags)
            return message.info("Preencha todos campos para prosseguir!")

        const data = new FormData();

        data.append('image', image);
        data.append('author', author);
        data.append('place', place);
        data.append('description', description);
        data.append('hashtags', hashtags);

        this.setState({ loading: true })

        await api.post('/posts', data);

        this.setState({ loading: false })

        this.props.history.push('/');
    }

    handleImageChange = e => {
        console.log(e.target.files[0])

        var file = e.target.files[0]

        if(!file) 
            return this.setState({ image: null });

        if (file.size > (1024 * 1024 * 5))
            return message.info("Imagem grande demais! Limite 5MB")

        if (file.type.indexOf('image') === -1)
            return message.info("Tipo de arquivo inválido. Tente novamente!")
        
        this.setState({ image: file })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <form id="new-post" onSubmit={this.handleSubmit}>

                <input
                    type="file"
                    onChange={this.handleImageChange}
                />

                <input
                    type="text"
                    name="author"
                    placeholder="Autor do Post"
                    onChange={this.handleChange}
                    value={this.state.author}
                />
                <input
                    type="text"
                    name="place"
                    placeholder="Local do Post"
                    onChange={this.handleChange}
                    value={this.state.place}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Descrição do Post"
                    onChange={this.handleChange}
                    value={this.state.description}
                />
                <input
                    type="text"
                    name="hashtags"
                    placeholder="Hashtags do Post"
                    onChange={this.handleChange}
                    value={this.state.hashtags}
                />
                <Spin spinning={this.state.loading} tip="Publicando seu post. Aguarde..." >
                    <button disabled={this.state.loading} type="submit">Enviar</button>
                </Spin>
            </form>
        )
    }
}

export default New;