<template lang="">
    <div class='container align-items-center mt-2'>
        <div class="row">
            <div class="col-sm-1">
            
            </div>
            <div class="col-sm-11">
                <div class="card">
                    <h5 class="card-header">群體共學</h5>
                    <div class="card-body">
                        <Log group_mode :room_id='room_id'
                        v-if='true'></Log>
                        
                    </div>
                </div>
                <div class="card">
                    <h5 class="card-header">同房間其他使用者列表</h5>
                    <div class="card-body overflow-auto">
                        <table id="example" class="table table-striped table-bordered" style="width:100%">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>名字</th>
                                    <th>情緒</th>
                                    <th>精神狀態</th>
                                    <th>正向程度</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>陳怡升</td>
                                    <td>高興</td>
                                    <td>0.5</td>
                                    <td>0.2</td>
                                    <td>pricean01@gmail.com</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>羅國平</td>
                                    <td>驚訝</td>
                                    <td>0.9</td>
                                    <td>0.8</td>
                                    <td>40811012e@ntnu.edu.tw</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>林芝安</td>
                                    <td>平常心</td>
                                    <td>0.7</td>
                                    <td>0.6</td>
                                    <td>chris.heart25@gmail.com</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>游毓堂</td>
                                    <td>高興</td>
                                    <td>0.8</td>
                                    <td>0.7</td>
                                    <td>thinkforgood1107@gmail.com</td>
                                </tr>
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>名稱</th>
                                    <th>情緒</th>
                                    <th>精神狀態</th>
                                    <th>正向程度</th>
                                    <th>Email</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Log from './LogData.vue'
export default {
    components: {
        Log
    },
    data(){
        return {
        }
    },
    computed:{
        room_id(){
            console.log("this.$route.query.id", this.$route.query.id)
            return this.$route.query.id
        },
    },
    mounted(){
        var t = $('#example').DataTable( {
            "columnDefs": [ {
                "searchable": false,
                "orderable": false,
                "targets": 0
            } ],
            "order": [[ 1, 'asc' ]]
        } );
        t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            } );
        } ).draw();
    },

}
</script>
<style lang="">
    
</style>